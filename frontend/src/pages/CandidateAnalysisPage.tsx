import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  FileJson,
  FileSpreadsheet,
  Download,
  ChevronDown,
  FileText,
  CheckCircle,
  AlertTriangle,
  Timer,
} from 'lucide-react';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- Interfaces ---
interface ResponseItem {
  questionId: number | string;
  text?: string;
  answer: string;
  answerValidation?: {
    evaluation: string;
    score: number;
  };
  dynamicAccuracy: number;
  isCorrect: boolean | null;
  videoUrl: string;
  duration?: number; // Duration in seconds for this question
}

interface InterviewResponse {
  candidateId: string;
  job_id: number;
  responses: ResponseItem[];
  submittedAt: string;
  totalDuration?: number; // Total duration in seconds
}

interface Candidate {
  id?: string;
  candidateId?: string;
  jobId: string;
  status: 'Selected' | 'Rejected';
  title: string;
}

// --- Utility Function to Format Duration ---
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}, ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}, ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  } else {
    return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }
};

// --- PerformanceSummary Component ---
interface PerformanceSummaryProps {
  totalValidation: number;
  totalDynamic: number;
  correct: number;
  incorrect: number;
  totalDuration: number; // Add total duration prop
}

function PerformanceSummary({
  totalValidation,
  totalDynamic,
  correct,
  incorrect,
  totalDuration,
}: PerformanceSummaryProps) {
  return (
    <section>
      <h2 className="text-xl text-purple-400 mb-4 flex items-center gap-2">
        <span className="i-lucide-bar-chart-2"></span>
        Performance Summary
      </h2>
      <div className="grid grid-cols-5 gap-4"> {/* Updated to 5 columns */}
        <div className="bg-[#12121a] p-6 rounded-lg shadow-lg border border-gray-800">
          <div className="text-gray-400 mb-2">Validation Score</div>
          <div className="text-2xl font-bold text-red-500">{totalValidation}/100</div>
        </div>
        <div className="bg-[#12121a] p-6 rounded-lg shadow-lg border border-gray-800">
          <div className="text-gray-400 mb-2">Dynamic Accuracy</div>
          <div className="text-2xl font-bold text-red-500">{totalDynamic}%</div>
        </div>
        <div className="bg-[#12121a] p-6 rounded-lg shadow-lg border border-gray-800">
          <div className="text-gray-400 mb-2">Correct Answers</div>
          <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {correct}
          </div>
        </div>
        <div className="bg-[#12121a] p-6 rounded-lg shadow-lg border border-gray-800">
          <div className="text-gray-400 mb-2">Incorrect Answers</div>
          <div className="text-2xl font-bold text-red-500 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {incorrect}
          </div>
        </div>
        <div className="bg-[#12121a] p-6 rounded-lg shadow-lg border border-gray-800">
          <div className="text-gray-400 mb-2">Total Duration</div>
          <div className="text-2xl font-bold text-purple-500 flex items-center gap-2">
            <Timer className="w-5 h-5" />
            {formatDuration(totalDuration)}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- DetailedAnalysis & QuestionDetails Components ---
function QuestionDetails({ question }: { question: ResponseItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#12121a] rounded-lg mb-3 border border-gray-800 overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-[#1a1a23] transition-colors flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-purple-400" />
          <span className="text-white">
            Question {question.questionId}: {question.text}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-red-500">
            {question.answerValidation ? `${question.answerValidation.score}/100` : 'N/A'}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-800 bg-[#0a0a0f]">
          <div className="grid grid-cols-4 gap-4 mb-6"> {/* Updated to 4 columns */}
            <div>
              <div className="text-sm text-gray-400 mb-1">Validation Score</div>
              <div className="text-xl text-red-500">
                {question.answerValidation ? `${question.answerValidation.score}/100` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Dynamic Accuracy</div>
              <div className="text-xl text-red-500">{question.dynamicAccuracy}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Answer Length</div>
              <div className="text-xl text-red-500">{question.answer.length} characters</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Duration</div>
              <div className="text-xl text-purple-500">
                {question.duration ? formatDuration(question.duration) : 'N/A'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">Candidate's Answer:</div>
              <div className="bg-[#12121a] p-3 rounded-lg text-gray-300">{question.answer}</div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-2">Video Response:</div>
              {question.videoUrl ? (
                <video className="w-full rounded-lg" controls src={question.videoUrl} />
              ) : (
                <div className="text-gray-400">No video available</div>
              )}
            </div>

            {question.answerValidation && (
              <div>
                <div className="text-sm text-gray-400 mb-2">Evaluation:</div>
                <div className="bg-[#12121a] p-3 rounded-lg text-gray-300">
                  {question.answerValidation.evaluation}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailedAnalysis({ questions }: { questions: ResponseItem[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl text-purple-400 mb-4 flex items-center gap-2">
        <span className="i-lucide-list"></span>
        Detailed Analysis
      </h2>
      <div className="space-y-3">
        {questions.map((question) => (
          <QuestionDetails key={question.questionId} question={question} />
        ))}
      </div>
    </section>
  );
}

// --- CandidateAnalysisPage Component ---
const CandidateAnalysisPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const candidate: Candidate | undefined = location.state?.candidate;
  const [interviewData, setInterviewData] = useState<InterviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div>Error: Candidate data not available.</div>
      </div>
    );
  }

  const candidateId = candidate.id || candidate.candidateId;
  if (!candidateId) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div>Error: Candidate ID is missing.</div>
      </div>
    );
  }

  const numericJobId = Number(candidate.jobId);
  if (isNaN(numericJobId)) {
    console.error("Candidate jobId is not a number");
  }

  // Fetch interview response data from the API
  useEffect(() => {
    axios
      .get(
        `https://xdv7men72j.execute-api.us-east-1.amazonaws.com/default/getAnalysis?candidateId=${candidateId}&job_id=${numericJobId}`
      )
      .then((response) => {
        setInterviewData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching interview response:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [candidateId, numericJobId]);

  // Process responses if available
  const responses: ResponseItem[] = interviewData?.responses || [];
  const totalValidation = responses.reduce(
    (acc, resp) => acc + (resp.answerValidation ? resp.answerValidation.score : 0),
    0
  );
  const totalDynamic = responses.reduce((acc, resp) => acc + resp.dynamicAccuracy, 0);
  const avgValidation = responses.length ? Number((totalValidation / responses.length).toFixed(1)) : 0;
  const avgDynamic = responses.length ? Number((totalDynamic / responses.length).toFixed(1)) : 0;
  const correctCount = responses.filter(
    (resp) => resp.answerValidation && resp.answerValidation.score >= 50
  ).length;
  const incorrectCount = responses.length - correctCount;
  const totalDuration = interviewData?.totalDuration || 0; // Get totalDuration from interviewData

  const computedStatus = avgValidation >= 40 ? 'Selected' : 'Rejected';

  // Chart Data
  const barChartData = {
    labels: responses.map((resp) => `Q${resp.questionId}`),
    datasets: [
      {
        label: 'Validation Score',
        data: responses.map((resp) => (resp.answerValidation ? resp.answerValidation.score : 0)),
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [correctCount, incorrectCount],
        backgroundColor: ['rgba(34, 197, 94, 0.5)', 'rgba(239, 68, 68, 0.5)'],
        borderColor: ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const radarChartData = {
    labels: ['Avg Validation', 'Avg Dynamic Accuracy'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [avgValidation, avgDynamic],
        backgroundColor: 'rgba(147, 51, 234, 0.2)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const, labels: { color: '#fff' } },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' as const, labels: { color: '#fff' } } },
  };

  const radarOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' as const, labels: { color: '#fff' } } },
    scales: {
      r: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.1)' },
        pointLabels: { color: '#fff' },
        ticks: { color: '#fff' },
      },
    },
  };

  const exportToPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.setFontSize(20);
      pdf.text('Candidate Performance Analysis', pdfWidth / 2, 20, { align: 'center' });
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('candidate-analysis.pdf');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors mb-4"
        >
          Back
        </button>

        <div className="bg-[#12121a] rounded-lg p-6 shadow-xl mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{candidate.id || candidate.candidateId}</h2>
              <div className="flex items-center text-gray-400">
                <span>Position: {candidate.title}</span>
                <span className="mx-4">|</span>
                <span>Job ID: {candidate.jobId}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Overall Score</div>
              <div className="text-3xl font-bold text-red-500">
                {responses.length ? avgValidation : 0}/100
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                  computedStatus === 'Selected'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {computedStatus}
              </span>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button className="flex items-center px-4 py-2 bg-[#1a1a23] hover:bg-[#22222c] rounded-md">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button className="flex items-center px-4 py-2 bg-[#1a1a23] hover:bg-[#22222c] rounded-md">
              <FileJson className="w-4 h-4 mr-2" />
              Export JSON
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center px-4 py-2 bg-[#1a1a23] hover:bg-[#22222c] rounded-md"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        <div ref={chartRef} className="space-y-8">
          <PerformanceSummary
            totalValidation={avgValidation}
            totalDynamic={avgDynamic}
            correct={correctCount}
            incorrect={incorrectCount}
            totalDuration={totalDuration}
          />

          <section>
            <h3 className="text-xl text-purple-400 mb-4">Performance Visualization</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-[#12121a] p-4 rounded-lg">
                <h4 className="text-lg mb-4">Validation Score by Question</h4>
                <Bar data={barChartData} options={chartOptions} />
              </div>
              <div className="bg-[#12121a] p-4 rounded-lg">
                <h4 className="text-lg mb-4">Correct vs Incorrect</h4>
                <Pie data={pieChartData} options={pieOptions} />
              </div>
              <div className="bg-[#12121a] p-4 rounded-lg">
                <h4 className="text-lg mb-4">Performance Radar</h4>
                <Radar data={radarChartData} options={radarOptions} />
              </div>
            </div>
          </section>

          {responses.length > 0 ? (
            <DetailedAnalysis questions={responses} />
          ) : (
            <div className="text-center text-gray-400">No detailed question responses available.</div>
          )}

          <div className="mt-8">
            <p>
              <strong>Submitted At:</strong> {interviewData?.submittedAt || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateAnalysisPage;