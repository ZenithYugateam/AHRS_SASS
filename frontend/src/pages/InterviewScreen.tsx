import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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

interface AnswerValidation {
  evaluation: string;
  score: number;
}

interface ResponseData {
  questionId: number;
  answer: string;
  text: string;
  correctAnswer?: string;
  videoUrl?: string;
  dynamicEvaluation?: string;
  dynamicAccuracy?: number;
  answerValidation?: AnswerValidation;
  duration?: number; // Time spent on this question in seconds
}

function InterviewScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [job, setJob] = useState(() => {
    if (state && state.job) {
      localStorage.setItem("selectedJob", JSON.stringify(state.job));
      return state.job;
    }
    const stored = localStorage.getItem("selectedJob");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (!job) {
      console.error("Job data not provided. Redirecting back to CandidateHome.");
      navigate("/candidate");
    }
  }, [job, navigate]);

  if (!job) return null;

  const candidateEmail = sessionStorage.getItem("user") || "no candidate id";
  const email = JSON.parse(candidateEmail).email;

  // State and Ref variables
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const responsesRef = useRef<ResponseData[]>([]); // Add ref to track responses
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [candidateId] = useState<string>(email);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseMessage, setPauseMessage] = useState("");
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [dynamicCount, setDynamicCount] = useState(0);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [warningCount, setWarningCount] = useState(0);
  const [nextProcessing, setNextProcessing] = useState(false);
  const [apiProcessing, setApiProcessing] = useState(false);
  const pauseTimerRef = useRef<number | null>(null);
  const questionStartTimeRef = useRef<number | null>(null); // Track start time of each question

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const OPENAI_API_KEY = "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";
  const STORE_INTERVIEW_ENDPOINT = "https://vbajfgmatb.execute-api.us-east-1.amazonaws.com/prod/storeInterview";
  const CANDIDATE_STATUS_ENDPOINT = "https://l1i2uu3p32.execute-api.us-east-1.amazonaws.com/default/post_candidate_status";
  const PRESIGNED_URL_ENDPOINT = "https://071h9ufh65.execute-api.us-east-1.amazonaws.com/singedurl";

  // Speech Synthesis Setup
  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const maleVoices = voices.filter((voice) => !voice.name.toLowerCase().includes("female"));
      setMaleVoice(maleVoices[0] || voices[0]);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => speechSynthesisRef.current?.cancel();
  }, []);

  // Restrict Copy-Paste and Tab Switching
  useEffect(() => {
    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      incrementWarning("Copying/Cutting is not allowed!");
    };
    const handleVisibilityChange = () => {
      if (document.hidden) incrementWarning("Tab switching is not allowed!");
    };
    const incrementWarning = (message: string) => {
      setWarningCount((prev) => {
        const newCount = prev + 1;
        if (newCount < 4) {
          alert(`${message} Warning ${newCount} of 3.`);
        } else {
          alert("You have exceeded the allowed warnings. The interview will be terminated.");
          navigate("/candidate-dashboard", { state: { message: "Interview terminated due to suspicious activity." } });
        }
        return newCount;
      });
    };
    window.addEventListener("copy", handleCopyPaste);
    window.addEventListener("cut", handleCopyPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("copy", handleCopyPaste);
      window.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);

  // Fetch Questions
  useEffect(() => {
    axios
      .get("https://q06ec9jvd4.execute-api.us-east-1.amazonaws.com/qa/get_questions", {
        params: { company_id: job.company_id, job_id: job.job_id || job.id },
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
        const allQuestions = [
          {
            id: 1,
            text: "Please describe your most recent project and your role in it. Include key technologies and challenges you faced.",
          },
          ...apiQuestions,
        ];
        console.log("Initial questions:", allQuestions);
        setQuestions(allQuestions);
        if (response.data.total_time) {
          const totalSec = response.data.total_time * 60;
          setTotalTime(totalSec);
          setTimeLeft(Math.floor(totalSec / allQuestions.length));
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setQuestions([
          {
            id: 1,
            text: "Please describe your most recent project and your role in it. Include key technologies and challenges you faced.",
          },
        ]);
      });
  }, [job]);

  // Timer Effect
  useEffect(() => {
    if (isInterviewStarted && !isPaused && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (isInterviewStarted && !isPaused && timeLeft === 0) {
      handleNextOrFinish();
    }
  }, [timeLeft, isInterviewStarted, isPaused]);

  // Update Answer from Transcript
  useEffect(() => {
    if (isVoiceMode) setAnswer(transcript);
  }, [transcript, isVoiceMode]);

  // Speak Current Question and Start Timer
  useEffect(() => {
    if (isInterviewStarted && questions[currentQuestion]) {
      const perQuestionTime = Math.floor(totalTime / questions.length);
      readQuestion();
      setTimeLeft(perQuestionTime);
      questionStartTimeRef.current = Date.now(); // Start timing for this question
    }
  }, [currentQuestion, isInterviewStarted, totalTime, questions]);

  const readQuestion = () => {
    if (speechSynthesisRef.current && questions[currentQuestion]) {
      speechSynthesisRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      if (maleVoice) utterance.voice = maleVoice;
      speechSynthesisRef.current.speak(utterance);
    }
  };

  // Video Recording and Upload
  const uploadVideoToS3 = async (videoBlob: Blob): Promise<string> => {
    try {
      const currentQuestionId = questions[currentQuestion].id.toString();
      const presignedResponse = await axios.post(
        PRESIGNED_URL_ENDPOINT,
        { candidateId, questionId: currentQuestionId },
        { headers: { "Content-Type": "application/json" } }
      );
      const { uploadURL, fileName } = presignedResponse.data;
      const putResponse = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": "video/webm" },
        body: videoBlob,
      });
      if (!putResponse.ok) throw new Error(`S3 upload failed with status ${putResponse.status}`);
      return `https://avhrsvideobucket.s3.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error("Error uploading video to S3:", error);
      throw error;
    }
  };

  const startVideoRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
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

  // Validate Answer
  const validateCandidateAnswer = async (candidateAnswer: string, question: Question) => {
    try {
      const prompt = `
Please evaluate the candidate's answer for the following question.
Question: "${question.text}"
Candidate Answer: "${candidateAnswer}"
${question.correctAnswer ? `Correct Answer: "${question.correctAnswer}"` : ""}
Provide a brief evaluation and a score between 0 and 100.
Format your response as:
Evaluation: <your evaluation comment>. Score: <score>%
      `;
      const validationResponse = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "qwen/qwq-32b:free",
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
      const content = validationResponse.data.choices[0].message.content;
      const [evalPart] = content.split(". Score:");
      const scoreMatch = content.match(/Score:\s*(\d+)%/);
      const score = scoreMatch && scoreMatch[1] ? parseInt(scoreMatch[1], 10) : 0;
      return { evaluation: evalPart.replace("Evaluation:", "").trim(), score };
    } catch (error) {
      console.error("Error validating candidate answer:", error);
      return { evaluation: "Validation failed", score: 0 };
    }
  };

  // Generate Dynamic Question
  const generateDynamicQuestion = async (candidateAnswer: string, staticQuestion: Question) => {
    try {
      if (dynamicCount >= 2) return { dynamicQuestion: "", dynamicEvaluation: "", dynamicAccuracy: 0 };
      const prompt = `
You are a friendly and insightful interviewer. Based on the candidate's response: "${candidateAnswer}",
ask one natural follow-up question that delves deeper into their project experience without repeating the original question.
Also, provide a brief conversational evaluation with an accuracy rating (percentage) indicating how well the candidate answered.
Format your response as:
Follow-up Question: <your question>
Evaluation: <your evaluation comment>. Accuracy: <percentage>%
      `;
      const chatGPTResponse = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "qwen/qwq-32b:free",
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

  // Interview Flow
  const startInterview = async () => {
    if (questions.length === 0) {
      alert("Questions are still loading. Please wait.");
      return;
    }
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) =>
        console.error("Error enabling full-screen mode:", err)
      );
    }
    setIsInterviewStarted(true);
    setTimeLeft(Math.floor(totalTime / questions.length));
    questionStartTimeRef.current = Date.now(); // Start timing for first question
    await startVideoRecording();
    readQuestion();
  };

  const handleNextOrFinish = async () => {
    if (nextProcessing) return;
    setNextProcessing(true);
    setApiProcessing(true);

    if (!questions[currentQuestion]) return;

    const candidateAnswer = questions[currentQuestion].options ? selectedOption || "" : answer;
    const currentResponse: ResponseData = {
      questionId: questions[currentQuestion].id,
      text: questions[currentQuestion].text,
      answer: candidateAnswer,
      correctAnswer: questions[currentQuestion].correctAnswer,
    };

    // Calculate duration for this question
    const endTime = Date.now();
    if (questionStartTimeRef.current) {
      const duration = Math.floor((endTime - questionStartTimeRef.current) / 1000); // Duration in seconds
      currentResponse.duration = duration;
    }

    const validation = await validateCandidateAnswer(candidateAnswer, questions[currentQuestion]);
    currentResponse.answerValidation = validation;

    const { dynamicQuestion, dynamicEvaluation, dynamicAccuracy } = await generateDynamicQuestion(
      candidateAnswer,
      questions[currentQuestion]
    );

    if (dynamicQuestion && dynamicCount < 2) {
      currentResponse.dynamicEvaluation = dynamicEvaluation;
      currentResponse.dynamicAccuracy = dynamicAccuracy;
      const dynamicQ: Question = { id: Date.now(), text: dynamicQuestion };
      setQuestions((prev) => {
        const newArr = [...prev];
        newArr.splice(currentQuestion + 1, 0, dynamicQ);
        console.log(`Inserted dynamic question ${dynamicQ.id}. New questions:`, newArr);
        return newArr;
      });
    }

    // Stop recording and wait for the video URL
    stopVideoRecording();
    let videoUrl: string | undefined;
    if (mediaRecorderRef.current && isRecording) {
      videoUrl = await new Promise<string>((resolve) => {
        mediaRecorderRef.current!.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const url = await uploadVideoToS3(blob);
          resolve(url);
        };
      });
    }

    // Store the response with videoUrl and duration in both state and ref
    setResponses((prev) => {
      const updatedResponses = [
        ...prev.filter((r) => r.questionId !== currentResponse.questionId),
        { ...currentResponse, videoUrl },
      ];
      responsesRef.current = updatedResponses; // Update ref
      console.log(
        `Stored response for question ${currentResponse.questionId} with videoUrl and duration ${currentResponse.duration}s. Responses:`,
        updatedResponses
      );
      return updatedResponses;
    });

    setAnswer("");
    setSelectedOption(null);
    resetTranscript();

    setApiProcessing(false);
    setIsPaused(true);
    setPauseMessage("Processing your response...");

    speechSynthesisRef.current?.cancel();

    pauseTimerRef.current = window.setTimeout(() => {
      resumeInterview();
    }, 3000);
  };

  const resumeInterview = async () => {
    setIsPaused(false);
    setNextProcessing(false);
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => {
        const next = prev + 1;
        console.log(`Advancing to question ${next + 1}/${questions.length} (ID: ${questions[next].id})`);
        return next;
      });
      setAnswer("");
      setSelectedOption(null);
      resetTranscript();
      setTimeLeft(Math.floor(totalTime / questions.length));
      questionStartTimeRef.current = Date.now(); // Reset start time for next question
      await startVideoRecording();
    } else {
      console.log("All questions completed. Submitting interview with responses:", responsesRef.current);
      setIsInterviewStarted(false);
      submitInterview();
    }
  };

  // Final Evaluation & Submission
  const evaluateInterview = async () => {
    const totalValidatedScore = responsesRef.current.reduce((acc, res) => acc + (res.answerValidation?.score || 0), 0);
    const avgValidatedScore = responsesRef.current.length > 0 ? totalValidatedScore / responsesRef.current.length : 0;
    setFinalScore(avgValidatedScore);
    return avgValidatedScore;
  };

  const submitInterview = async () => {
    if (!email || responsesRef.current.length === 0) {
      alert("Candidate ID or responses are missing. Please complete the interview before submitting.");
      return;
    }
    setSubmissionLoading(true);
    try {
      const avgValidatedScore = await evaluateInterview();
      const totalDuration = responsesRef.current.reduce((acc, res) => acc + (res.duration || 0), 0); // Total interview time in seconds
      console.log("Individual durations:", responsesRef.current.map((r) => `${r.questionId}: ${r.duration}s`));
      console.log(`Total duration: ${totalDuration}s (${(totalDuration / 60).toFixed(2)} minutes)`);
      const candidateStatus = avgValidatedScore > 40 ? 10 : 5;
      const jobIdInt = parseInt(job.job_id || job.id, 10);
      await axios.post(
        CANDIDATE_STATUS_ENDPOINT,
        { candidateId, companyId: job.company_id, jobId: jobIdInt, status: candidateStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      const payload = {
        candidateId,
        jobId: jobIdInt,
        responses: responsesRef.current,
        finalScore: avgValidatedScore,
        totalDuration, // Include total duration in payload
      };
      console.log("Submitting payload:", payload);
      await axios.post(STORE_INTERVIEW_ENDPOINT, payload, { headers: { "Content-Type": "application/json" } });
      setSubmitted(true);
      setTimeout(() => {
        navigate("/candidate-dashboard", { state: { message: "Thanks for attending the interview, we will update you soon." } });
      }, 3000);
    } catch (error) {
      console.error("Error during submission:", error);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/candidate-dashboard", { state: { message: "Thanks for attending the interview, we will update you soon." } });
      }, 3000);
    } finally {
      setSubmissionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-white p-8">
      {!isInterviewStarted ? (
        <div className="max-w-3xl mx-auto">
          {!submitted ? (
            <div className="bg-[#1A1528] rounded-xl p-8 shadow-lg border border-gray-800 text-center">
              <h2 className="text-2xl font-bold mb-6">Ready to Start Your Interview?</h2>
              <p className="text-gray-300 mb-8">
                The interview will begin with a question about your project experience.
                You will have {totalTime / 60} minutes total to answer all questions.
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
              <h2 className="text-2xl font-bold mb-4">Thanks for attending the interview</h2>
              <p className="text-gray-300">We will update you soon.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {isPaused ? (
            <div className="bg-[#1A1528] rounded-xl p-8 shadow-lg border border-gray-800 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-xl mb-4">{pauseMessage}</p>
              <button
                onClick={() => {
                  if (pauseTimerRef.current) {
                    clearTimeout(pauseTimerRef.current);
                    pauseTimerRef.current = null;
                  }
                  resumeInterview();
                }}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
              >
                Skip Wait
              </button>
            </div>
          ) : (
            <div className="bg-[#1A1528] rounded-xl p-8 shadow-lg border border-gray-800">
              <div className="mb-8">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-64 bg-black rounded-lg object-cover" />
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
                  <div className="flex gap-4 mb-4 items-center">
                    <button
                      onClick={() => setIsVoiceMode(false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${!isVoiceMode ? "bg-purple-600" : "bg-[#2A1528]"}`}
                    >
                      <Type className="w-5 h-5" />
                      Text
                    </button>
                    <button
                      onClick={toggleVoiceMode}
                      className={`flex items-center gap.purchase2 px-4 py-2 rounded-lg transition-all ${
                        isVoiceMode && listening ? "bg-purple-600" : "bg-[#2A1528]"
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                      Voice
                      {isVoiceMode && listening && (
                        <span className="ml-2 flex items-center gap-1">
                          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                          Recording...
                        </span>
                      )}
                      {isVoiceMode && !listening && <span className="ml-2 text-green-400">Saved</span>}
                    </button>
                  </div>
                  <textarea
                    value={answer}
                    onChange={(e) => !isVoiceMode && setAnswer(e.target.value)}
                    placeholder={isVoiceMode ? "Speak your answer..." : "Type your answer..."}
                    className="w-full h-32 px-4 py-2 bg-[#2A1528] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg transition-all duration-500 animate-fadeIn"
                    readOnly={isVoiceMode}
                  />
                </>
              )}
              <div className="flex justify-end mt-8">
                {apiProcessing && (
                  <div className="mr-4 flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                    <span className="ml-2">Processing your answer...</span>
                  </div>
                )}
                <button
                  onClick={handleNextOrFinish}
                  disabled={nextProcessing || apiProcessing}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors disabled:opacity-50"
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