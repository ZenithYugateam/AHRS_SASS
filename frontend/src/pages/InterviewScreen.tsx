import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mic, Type, Timer, Play } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface Question {
  id: number;
  text: string;
  // Optionally, you can include the correct answer if needed for later validation:
  correctAnswer?: string;
  options?: string[];
}

interface Response {
  questionId: number;
  answer: string;
  videoUrl?: string;
}

function InterviewScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalTime, setTotalTime] = useState(30); // default; updated from API if provided
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Axios defaults (ensure the server allows these headers)
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.defaults.withCredentials = false;

  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Fetch questions and total_time from API
  useEffect(() => {
    axios
      .get("https://q06ec9jvd4.execute-api.us-east-1.amazonaws.com/qa/get_questions", {
        params: { company_id: "98765", job_id: "101" }
      })
      .then(response => {
        if (response.data && response.data.questions) {
          // Transform DynamoDB formatted questions into our expected format
          const fetchedQuestions = response.data.questions.map((q: any, index: number) => ({
            id: index + 1,
            text: q.M.question.S,            // Extract question text
            correctAnswer: q.M.answer.S,       // Optionally store correct answer
            options: q.M.options ? q.M.options : undefined
          }));
          setQuestions(fetchedQuestions);
          if (response.data.total_time) {
            setTotalTime(response.data.total_time);
            setTimeLeft(response.data.total_time);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  // Timer effect for each question
  useEffect(() => {
    if (isInterviewStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isInterviewStarted && timeLeft === 0) {
      // Auto-submit if time runs out
      handleNextOrFinish();
    }
  }, [timeLeft, isInterviewStarted]);

  // Update answer when using voice mode
  useEffect(() => {
    if (isVoiceMode) {
      setAnswer(transcript);
    }
  }, [transcript, isVoiceMode]);

  // When current question changes, immediately speak the question and reset timer
  useEffect(() => {
    if (isInterviewStarted && questions[currentQuestion]) {
      readQuestion();
      setTimeLeft(totalTime);
    }
  }, [currentQuestion, isInterviewStarted, totalTime, questions]);

  const readQuestion = () => {
    if (speechSynthesisRef.current && questions[currentQuestion]) {
      const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].text);
      speechSynthesisRef.current.speak(utterance);
    }
  };

  const startVideoRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setResponses(prev => {
          const currentResponse = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...currentResponse, videoUrl }];
        });
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);
      setIsRecording(false);
    }
  };

  const toggleVoiceMode = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support voice recognition.');
      return;
    }
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  const startInterview = async () => {
    if (questions.length === 0) {
      alert("Questions are still loading. Please wait.");
      return;
    }
    setIsInterviewStarted(true);
    setTimeLeft(totalTime);
    await startVideoRecording();
    readQuestion();
  };

  // Handle moving to next question or finishing the interview
  const handleNextOrFinish = async () => {
    if (!questions[currentQuestion]) return;
    
    // Build current response from current question
    const currentResponse: Response = {
      questionId: questions[currentQuestion].id,
      answer: questions[currentQuestion].options ? selectedOption || '' : answer
    };
    setResponses(prev => [...prev, currentResponse]);
    stopVideoRecording();

    if (currentQuestion < questions.length - 1) {
      // Proceed to next question
      setCurrentQuestion(prev => prev + 1);
      setAnswer('');
      setSelectedOption(null);
      resetTranscript();
      await startVideoRecording();
    } else {
      // Finish interview and validate answers using Cohere API directly from frontend
      setIsInterviewStarted(false);
      await validateAnswersAndShowResult();
    }
  };

  // Validate answers by sending them to Cohere API (using the API key directly in frontend)
  const validateAnswersAndShowResult = async () => {
    try {
      // Combine answers from all responses for validation
      const evaluationText = responses.map(r => r.answer).join(" ");
      
      // Call Cohere API with your API key
      const validationResponse = await axios.post(
        "https://api.cohere.ai/validate",
        { text: evaluationText },
        {
          headers: {
            Authorization: `Bearer ZN6MTQAeuWkRgOfifSgU2yfXjxemb5YGpW43g1eO`,
            "Content-Type": "application/json"
          }
        }
      );
      const validationData = validationResponse.data;
      console.log("Validation result:", validationData);
      setValidationResult(validationData);
    } catch (error) {
      console.error("Error during validation:", error);
      setValidationResult({ error: "Validation failed" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-white p-8">
      {!isInterviewStarted ? (
        <div className="max-w-3xl mx-auto">
          {responses.length === 0 ? (
            <div className="bg-[#1A1528] rounded-xl p-8 shadow-lg border border-gray-800 text-center">
              <h2 className="text-2xl font-bold mb-6">Ready to Start Your Interview?</h2>
              <p className="text-gray-300 mb-8">
                The questions will be read out loud and you'll have {totalTime} seconds to answer each question.
                Your video and audio will be recorded during the interview.
              </p>
              <button
                onClick={startInterview}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                Start Interview
              </button>
              {validationResult && (
                <div className="mt-6 p-4 bg-green-100 text-black rounded">
                  <h3 className="font-bold">Validation Result</h3>
                  <pre>{JSON.stringify(validationResult, null, 2)}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#1A1528] rounded-xl p-8 shadow-lg border border-gray-800 text-center">
              <h2 className="text-2xl font-bold mb-6">Interview Completed!</h2>
              <div className="space-y-6 mt-8">
                {responses.map((response, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4">
                    <p className="font-semibold mb-2">Question {index + 1}: {questions[index]?.text}</p>
                    <p className="text-gray-300 mb-2">Your Answer: {response.answer}</p>
                    {response.videoUrl && (
                      <video
                        src={response.videoUrl}
                        controls
                        className="w-full h-48 bg-black rounded-lg object-cover mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
              {validationResult && (
                <div className="mt-6 p-4 bg-green-100 text-black rounded">
                  <h3 className="font-bold">Validation Result</h3>
                  <pre>{JSON.stringify(validationResult, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1A1528] rounded-xl p-8 shadow-lg border border-gray-800">
            {/* Video Preview */}
            <div className="mb-8">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 bg-black rounded-lg object-cover"
              />
            </div>
            {/* Timer & Question */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                Question {currentQuestion + 1}/{questions.length}
              </h2>
              <div className="flex items-center gap-2 text-xl font-bold">
                <Timer className="w-6 h-6" />
                <span className={timeLeft <= 10 ? "text-red-500" : ""}>{timeLeft}s</span>
              </div>
            </div>
            <div className="mb-8 flex items-center gap-2">
              <p className="text-xl">{questions[currentQuestion].text}</p>
              <button
                onClick={readQuestion}
                className="p-2 rounded-full hover:bg-[#2A2538] transition-colors"
                title="Read question again"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
            {/* Answer Input */}
            {questions[currentQuestion].options ? (
              <div className="grid grid-cols-1 gap-4 mb-8">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    className={`p-4 rounded-lg border border-gray-700 text-left hover:bg-[#2A2538] transition-colors w-full ${
                      selectedOption === option ? 'bg-[#2A2538] border-purple-500' : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setIsVoiceMode(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${!isVoiceMode ? 'bg-purple-600' : 'bg-[#2A2538]'}`}
                  >
                    <Type className="w-5 h-5" />
                    Text
                  </button>
                  <button
                    onClick={toggleVoiceMode}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isVoiceMode ? 'bg-purple-600' : 'bg-[#2A2538]'}`}
                  >
                    <Mic className="w-5 h-5" />
                    Voice {listening && '(Recording...)'}
                  </button>
                </div>
                <textarea
                  value={answer}
                  onChange={(e) => !isVoiceMode && setAnswer(e.target.value)}
                  placeholder={isVoiceMode ? "Speak your answer..." : "Type your answer..."}
                  className="w-full h-32 px-4 py-2 bg-[#2A1528] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  readOnly={isVoiceMode}
                />
              </>
            )}
            {/* Navigation */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleNextOrFinish}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors"
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewScreen;
