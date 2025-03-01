import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Mic, Type, Timer, Play } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface Question {
  id: number;
  text: string;
  correctAnswer?: string;
  options?: string[];
  dynamicEvaluation?: string;
  dynamicAccuracy?: number;
}

interface ResponseData {
  questionId: number;
  answer: string;
  correctAnswer?: string;
  videoUrl?: string;  // S3 URL after video upload via pre-signed URL
  dynamicEvaluation?: string;
  dynamicAccuracy?: number;
}

function InterviewScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalTime, setTotalTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [candidateId, setCandidateId] = useState<string>("");
  const [isPaused, setIsPaused] = useState(false);
  const [pauseMessage, setPauseMessage] = useState("");
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [dynamicCount, setDynamicCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // --- Configuration Constants ---
  const OPENAI_API_KEY =
    "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";
  
  const STORE_INTERVIEW_ENDPOINT =
    "https://vbajfgmatb.execute-api.us-east-1.amazonaws.com/prod/storeInterview";

  // Pre-signed URL endpoint – note the path is "singedurl" as per your setup.
  const PRESIGNED_URL_ENDPOINT =
    "https://071h9ufh65.execute-api.us-east-1.amazonaws.com/singedurl";



  // --- Effects ---
  useEffect(() => {
    // Initialize speech synthesis; you can adjust voice parameters here if desired.
    speechSynthesisRef.current = window.speechSynthesis;
    return () => {
      speechSynthesisRef.current?.cancel();
    };
  }, []);

  // --- Fetch Questions ---
  useEffect(() => {
    axios
      .get("https://q06ec9jvd4.execute-api.us-east-1.amazonaws.com/qa/get_questions", {
        params: { company_id: "98765", job_id: "101" },
      })
      .then((response) => {
        let apiQuestions: Question[] = [];
        if (response.data && response.data.questions) {
          apiQuestions = response.data.questions.map((q: any, index: number) => ({
            id: index + 2,
            text: q.M.question.S,
            correctAnswer: q.M.answer.S,
            options: q.M.options ? q.M.options : undefined,
          }));
        }
        setQuestions([
          {
            id: 1,
            text:
              "Please describe your most recent project and your role in it. Include key technologies and challenges you faced.",
          },
          ...apiQuestions,
        ]);
        if (response.data.total_time) {
          setTotalTime(response.data.total_time);
          setTimeLeft(response.data.total_time);
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setQuestions([
          {
            id: 1,
            text:
              "Please describe your most recent project and your role in it. Include key technologies and challenges you faced.",
          },
        ]);
      });
  }, []);

  // --- Timer ---
  useEffect(() => {
    if (isInterviewStarted && !isPaused && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (isInterviewStarted && !isPaused && timeLeft === 0) {
      handleNextOrFinish();
    }
  }, [timeLeft, isInterviewStarted, isPaused]);

  // Update answer from transcript (voice mode)
  useEffect(() => {
    if (isVoiceMode) {
      // Optional: You could send transcript to an auto-correction API here.
      setAnswer(transcript);
    }
  }, [transcript, isVoiceMode]);

  // When current question changes, read it aloud and reset timer.
  useEffect(() => {
    if (isInterviewStarted && questions[currentQuestion]) {
      readQuestion();
      setTimeLeft(totalTime);
    }
  }, [currentQuestion, isInterviewStarted, totalTime, questions]);

  const readQuestion = () => {
    if (speechSynthesisRef.current && questions[currentQuestion]) {
      const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].text);
      // Optional: Adjust voice rate and pitch for a calm, friendly tone
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesisRef.current.speak(utterance);
    }
  };

  // --- Pre-signed URL Upload Flow ---
  const uploadVideoToS3 = async (videoBlob: Blob): Promise<string> => {
    try {
      const currentQuestionId = questions[currentQuestion].id.toString();
      console.log("Requesting presigned URL with:", { candidateId, questionId: currentQuestionId });
      const presignedResponse = await axios.post(
        PRESIGNED_URL_ENDPOINT,
        { candidateId, questionId: currentQuestionId },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Presigned response:", presignedResponse.data);
      const { uploadURL, fileName } = presignedResponse.data;
      const putResponse = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": "video/webm" },
        body: videoBlob,
      });
      if (!putResponse.ok) {
        throw new Error(`S3 upload failed with status ${putResponse.status}`);
      }
      const videoUrl = `https://avhrsvideobucket.s3.amazonaws.com/${fileName}`;
      console.log("Uploaded video URL:", videoUrl);
      return videoUrl;
    } catch (error) {
      console.error("Error uploading video to S3:", error);
      throw error;
    }
  };

  // --- Video Recording Flow ---
  const startVideoRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        try {
          const videoUrl = await uploadVideoToS3(blob);
          // Update the current response with the videoUrl
          setResponses((prev) => {
            const currentResponse = prev[prev.length - 1] || {};
            return [...prev.slice(0, -1), { ...currentResponse, videoUrl }];
          });
        } catch (error) {
          console.error("Error during video upload:", error);
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stream?.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsRecording(false);
    }
  };

  const toggleVoiceMode = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support voice recognition.");
      return;
    }
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  // --- Dynamic Follow-up Generation ---
  const generateDynamicQuestion = async (candidateAnswer: string, staticQuestion: Question) => {
    try {
      if (dynamicCount >= MAX_DYNAMIC_COUNT)
        return { dynamicQuestion: " ", dynamicEvaluation: "", dynamicAccuracy: 0 };
      const prompt = `
You are a friendly and insightful interviewer. Based on the candidate's response: "${candidateAnswer}",
ask one natural follow-up question that delves deeper into their project experience without repeating the original question.
Also, provide a brief conversational evaluation with an accuracy rating (percentage) indicating how well the candidate answered.
Format your response as:
Follow-up Question: <your question>
Evaluation: <your evaluation comment>. Accuracy: <percentage>%
      `;
      const chatGPTResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
      const content = chatGPTResponse.data.choices[0].message.content;
      const [questionPart, evaluationPart] = content.split("\nEvaluation:");
      const dynamicQuestion = questionPart.replace("Follow-up Question:", "").trim();
      let dynamicEvaluation = "";
      let dynamicAccuracy = 0;
      if (evaluationPart) {
        dynamicEvaluation = evaluationPart.trim();
        const accuracyMatch = dynamicEvaluation.match(/Accuracy:\s*(\d+)%/);
        if (accuracyMatch && accuracyMatch[1]) {
          dynamicAccuracy = parseInt(accuracyMatch[1], 10);
          dynamicEvaluation = dynamicEvaluation.replace(/Accuracy:\s*\d+%/, "").trim();
        }
      }
      setDynamicCount((prev) => prev + 1);
      return { dynamicQuestion, dynamicEvaluation, dynamicAccuracy };
    } catch (error) {
      console.error("Error generating dynamic question:", error);
      return { dynamicQuestion: "", dynamicEvaluation: "Evaluation failed", dynamicAccuracy: 0 };
    }
  };

  // --- Interview Flow ---
  const startInterview = async () => {
    if (questions.length === 0) {
      alert("Questions are still loading. Please wait.");
      return;
    }
    // Generate and set candidateId before any uploads occur.
    const generatedCandidateId = "cand_" + Math.random().toString(36).substr(2, 9);
    setCandidateId(generatedCandidateId);
    setIsInterviewStarted(true);
    setTimeLeft(totalTime);
    await startVideoRecording();
    readQuestion();
  };

  const handleNextOrFinish = async () => {
    if (!questions[currentQuestion]) return;
    const candidateAnswer = questions[currentQuestion].options
      ? selectedOption || ""
      : answer;
    const currentResponse: ResponseData = {
      questionId: questions[currentQuestion].id,
      answer: candidateAnswer,
      correctAnswer: questions[currentQuestion].correctAnswer,
    };
    const { dynamicQuestion, dynamicEvaluation, dynamicAccuracy } =
      await generateDynamicQuestion(candidateAnswer, questions[currentQuestion]);
    if (dynamicQuestion) {
      currentResponse.dynamicEvaluation = dynamicEvaluation;
      currentResponse.dynamicAccuracy = dynamicAccuracy;
      const dynamicQ: Question = { id: Date.now(), text: dynamicQuestion };
      setQuestions((prev) => {
        const newArr = [...prev];
        newArr.splice(currentQuestion + 1, 0, dynamicQ);
        return newArr;
      });
    }
    setResponses((prev) => [...prev, currentResponse]);
    stopVideoRecording();

    // Provide a tip to the candidate to create a comfortable transition.
    setIsPaused(true);
    setPauseMessage("Great response! Now, please wait while we move to the next question. Remember, take a deep breath and relax.");
    setAnswer("");
    setSelectedOption(null);
    resetTranscript();

    setTimeout(async () => {
      setIsPaused(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(totalTime);
        await startVideoRecording();
      } else {
        setIsInterviewStarted(false);
      }
    }, 5000);
  };

  // --- Submission ---
  const submitInterview = async () => {
    if (!candidateId || responses.length === 0) {
      console.error("Candidate ID or responses are missing:", candidateId, responses);
      alert("Candidate ID or responses are missing. Please complete the interview before submitting.");
      return;
    }
    setSubmissionLoading(true);
    try {
      const payload = { candidateId, jobId: "101", responses };
      console.log("Submitting payload:", payload);
      const lambdaResponse = await axios.post(
        STORE_INTERVIEW_ENDPOINT,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      const data = lambdaResponse.data;
      console.log("Validation result:", data);
      setValidationResult(data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error during submission:", error);
      setValidationResult({ error: "Submission failed" });
    } finally {
      setSubmissionLoading(false);
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
                The interview will begin with a question about your project experience.
                You will have {totalTime} seconds to answer each question.
                Your video and audio will be recorded during the interview.
              </p>
              <button
                onClick={startInterview}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                Start Interview
              </button>
            </div>
          ) : (
            <div className="bg-[#1A1528] rounded-xl p-8 shadow-lg border border-gray-800 text-center">
              <h2 className="text-2xl font-bold mb-6">Interview Completed!</h2>
              <div className="space-y-6 mt-8">
                {responses.map((response, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4">
                    <p className="font-semibold mb-2">
                      Question {index + 1}: {questions[index]?.text}
                    </p>
                    <p className="text-gray-300 mb-2">
                      Your Answer: {response.answer}
                      {response.correctAnswer && ` | Correct Answer: ${response.correctAnswer}`}
                    </p>
                    {response.dynamicEvaluation && (
                      <p className="mt-1 text-green-300">
                        Evaluation: {response.dynamicEvaluation}
                        {response.dynamicAccuracy ? ` (Accuracy: ${response.dynamicAccuracy}%)` : ""}
                      </p>
                    )}
                    {response.videoUrl && (
                      <div className="mt-2 text-sm text-gray-400">
                        Video S3 URL: {response.videoUrl}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {!submitted && (
                <button
                  onClick={submitInterview}
                  disabled={submissionLoading}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors"
                >
                  {submissionLoading ? "Submitting..." : "Submit Interview"}
                </button>
              )}
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
          {isPaused ? (
            <div className="bg-[#1A1528] rounded-xl p-8 shadow-lg border border-gray-800 text-center">
              <p className="text-xl">{pauseMessage}</p>
            </div>
          ) : (
            <div className="bg-[#1A1528] rounded-xl p-8 shadow-lg border border-gray-800">
              <div className="mb-8">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-64 bg-black rounded-lg object-cover"
                />
              </div>
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
              {questions[currentQuestion].options ? (
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {questions[currentQuestion].options!.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedOption(option)}
                      className={`p-4 rounded-lg border border-gray-700 text-left hover:bg-[#2A2538] transition-colors w-full ${
                        selectedOption === option ? "bg-[#2A1528] border-purple-500" : ""
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        !isVoiceMode ? "bg-purple-600" : "bg-[#2A1528]"
                      }`}
                    >
                      <Type className="w-5 h-5" />
                      Text
                    </button>
                    <button
                      onClick={toggleVoiceMode}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        isVoiceMode ? "bg-purple-600" : "bg-[#2A1528]"
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                      Voice {listening && "(Recording...)"}
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
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleNextOrFinish}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors"
                >
                  {currentQuestion === questions.length - 1 ? "Finish" : "Next Question"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InterviewScreen;

function uploadVideoToS3(blob: Blob) {
  throw new Error("Function not implemented.");
}
