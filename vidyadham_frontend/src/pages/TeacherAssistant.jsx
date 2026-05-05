import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import API from '../services/api';
import './TeacherAssistant.css';

// --- Tab Icons ---
const GenerateIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

const EvaluateIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

const ImproveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2a4.5 4.5 0 00-4.5 4.5c0 1.657.896 3.105 2.232 3.888L9 12l-1.5 2 1 1.5L7 18l1 2h8l1-2-1.5-2.5 1-1.5L15 12l-.732-1.612A4.5 4.5 0 0016.5 6.5 4.5 4.5 0 0012 2z" />
  </svg>
);

function TeacherAssistant() {
  const [activeTab, setActiveTab] = useState('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [resultAction, setResultAction] = useState('');

  // Generate form state
  const [genForm, setGenForm] = useState({
    subject: '',
    topic: '',
    grade: '',
    numberOfQuestions: 5,
    difficulty: 'Mixed',
    questionTypes: '',
  });

  // Evaluate form state
  const [evalForm, setEvalForm] = useState({
    questions: '',
    answers: '',
  });

  // Improve form state
  const [improveForm, setImproveForm] = useState({
    question: '',
    subject: '',
    targetDifficulty: 'Medium',
  });

  // Expanded answer keys
  const [expandedAnswers, setExpandedAnswers] = useState({});

  const toggleAnswer = (idx) => {
    setExpandedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // --- Handlers ---
  const handleGenerate = async () => {
    if (!genForm.subject || !genForm.topic) {
      setError('Please fill in Subject and Topic');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult(null);
    try {
      const res = await API.post('/teacher-assistant/generate', genForm);
      setResult(res.data.result);
      setResultAction('generate');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!evalForm.questions || !evalForm.answers) {
      setError('Please provide both questions and answers');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult(null);
    try {
      const res = await API.post('/teacher-assistant/evaluate', evalForm);
      setResult(res.data.result);
      setResultAction('evaluate');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to evaluate answers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!improveForm.question) {
      setError('Please provide a question to improve');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult(null);
    try {
      const res = await API.post('/teacher-assistant/improve', improveForm);
      setResult(res.data.result);
      setResultAction('improve');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze question');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'generate', label: 'Generate', icon: <GenerateIcon /> },
    { id: 'evaluate', label: 'Evaluate', icon: <EvaluateIcon /> },
    { id: 'improve', label: 'Improve', icon: <ImproveIcon /> },
  ];

  return (
    <PageLayout>
      <div className="ta-page">
        {/* Header */}
        <header className="ta-header">
          <div>
            <h1>
              <span className="ta-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M12 2a4.5 4.5 0 00-4.5 4.5c0 1.657.896 3.105 2.232 3.888L9 12l-1.5 2 1 1.5L7 18l1 2h8l1-2-1.5-2.5 1-1.5L15 12l-.732-1.612A4.5 4.5 0 0016.5 6.5 4.5 4.5 0 0012 2z" />
                </svg>
              </span>
              Teacher Assistant
            </h1>
            <p>AI-powered tool to generate assignments, evaluate answers, and improve questions</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="ta-tabs" id="ta-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`ta-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.id); setError(''); }}
              id={`ta-tab-${tab.id}`}
            >
              <span className="ta-tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="ta-error" id="ta-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* ========== GENERATE TAB ========== */}
        {activeTab === 'generate' && (
          <div className="ta-form-card" id="ta-generate-form">
            <h3>
              <GenerateIcon /> Generate Assignment
            </h3>
            <div className="ta-form-grid">
              <div className="ta-field">
                <label>Subject *</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics"
                  value={genForm.subject}
                  onChange={(e) => setGenForm({ ...genForm, subject: e.target.value })}
                  id="gen-subject"
                />
              </div>
              <div className="ta-field">
                <label>Topic *</label>
                <input
                  type="text"
                  placeholder="e.g. Quadratic Equations"
                  value={genForm.topic}
                  onChange={(e) => setGenForm({ ...genForm, topic: e.target.value })}
                  id="gen-topic"
                />
              </div>
              <div className="ta-field">
                <label>Grade / Class</label>
                <input
                  type="text"
                  placeholder="e.g. Class 10"
                  value={genForm.grade}
                  onChange={(e) => setGenForm({ ...genForm, grade: e.target.value })}
                  id="gen-grade"
                />
              </div>
              <div className="ta-field">
                <label>Number of Questions</label>
                <select
                  value={genForm.numberOfQuestions}
                  onChange={(e) => setGenForm({ ...genForm, numberOfQuestions: Number(e.target.value) })}
                  id="gen-num-questions"
                >
                  {[3, 5, 8, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>{n} Questions</option>
                  ))}
                </select>
              </div>
              <div className="ta-field">
                <label>Difficulty</label>
                <select
                  value={genForm.difficulty}
                  onChange={(e) => setGenForm({ ...genForm, difficulty: e.target.value })}
                  id="gen-difficulty"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <div className="ta-field">
                <label>Question Types (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. MCQ, Short Answer, Long Answer"
                  value={genForm.questionTypes}
                  onChange={(e) => setGenForm({ ...genForm, questionTypes: e.target.value })}
                  id="gen-types"
                />
              </div>
            </div>
            <button className="ta-submit-btn" onClick={handleGenerate} disabled={isLoading} id="ta-generate-btn">
              {isLoading ? (
                <span className="btn-loading">
                  <span className="btn-spinner"></span>
                  Generating Assignment...
                </span>
              ) : (
                <>
                  <GenerateIcon /> Generate Assignment
                </>
              )}
            </button>
          </div>
        )}

        {/* ========== EVALUATE TAB ========== */}
        {activeTab === 'evaluate' && (
          <div className="ta-form-card" id="ta-evaluate-form">
            <h3>
              <EvaluateIcon /> Evaluate Answers
            </h3>
            <div className="ta-form-grid full">
              <div className="ta-field full-width">
                <label>Questions & Answer Keys *</label>
                <textarea
                  placeholder={"Paste the questions with their answer keys here...\n\nExample:\n1. What is photosynthesis? (5 marks)\nAnswer: Photosynthesis is the process by which plants convert light energy into chemical energy..."}
                  value={evalForm.questions}
                  onChange={(e) => setEvalForm({ ...evalForm, questions: e.target.value })}
                  id="eval-questions"
                />
              </div>
              <div className="ta-field full-width">
                <label>Student&apos;s Answers *</label>
                <textarea
                  placeholder={"Paste the student's answers here...\n\nExample:\n1. Photosynthesis is when plants make food using sunlight and water."}
                  value={evalForm.answers}
                  onChange={(e) => setEvalForm({ ...evalForm, answers: e.target.value })}
                  id="eval-answers"
                />
              </div>
            </div>
            <button className="ta-submit-btn" onClick={handleEvaluate} disabled={isLoading} id="ta-evaluate-btn">
              {isLoading ? (
                <span className="btn-loading">
                  <span className="btn-spinner"></span>
                  Evaluating Answers...
                </span>
              ) : (
                <>
                  <EvaluateIcon /> Evaluate Answers
                </>
              )}
            </button>
          </div>
        )}

        {/* ========== IMPROVE TAB ========== */}
        {activeTab === 'improve' && (
          <div className="ta-form-card" id="ta-improve-form">
            <h3>
              <ImproveIcon /> Improve Question
            </h3>
            <div className="ta-form-grid">
              <div className="ta-field full-width">
                <label>Question to Improve *</label>
                <textarea
                  placeholder="Paste your question here. The AI will analyze it and suggest improved versions..."
                  value={improveForm.question}
                  onChange={(e) => setImproveForm({ ...improveForm, question: e.target.value })}
                  style={{ minHeight: '100px' }}
                  id="improve-question"
                />
              </div>
              <div className="ta-field">
                <label>Subject (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Science"
                  value={improveForm.subject}
                  onChange={(e) => setImproveForm({ ...improveForm, subject: e.target.value })}
                  id="improve-subject"
                />
              </div>
              <div className="ta-field">
                <label>Target Difficulty</label>
                <select
                  value={improveForm.targetDifficulty}
                  onChange={(e) => setImproveForm({ ...improveForm, targetDifficulty: e.target.value })}
                  id="improve-difficulty"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            <button className="ta-submit-btn" onClick={handleImprove} disabled={isLoading} id="ta-improve-btn">
              {isLoading ? (
                <span className="btn-loading">
                  <span className="btn-spinner"></span>
                  Analyzing Question...
                </span>
              ) : (
                <>
                  <ImproveIcon /> Analyze & Improve
                </>
              )}
            </button>
          </div>
        )}

        {/* ========== RESULTS ========== */}
        {result && !result.parseError && (
          <div className="ta-results" id="ta-results">
            {/* --- Generate Results --- */}
            {resultAction === 'generate' && result.questions && (
              <>
                <div className="ta-result-header">
                  <h2>
                    📝 {result.title || 'Generated Assignment'}
                  </h2>
                  <span className={`ta-result-badge difficulty-${result.difficulty || 'Mixed'}`}>
                    {result.difficulty || 'Mixed'} Difficulty
                  </span>
                </div>

                <div className="ta-result-meta">
                  {result.subject && (
                    <span className="ta-meta-chip"><strong>Subject:</strong> {result.subject}</span>
                  )}
                  {result.grade && (
                    <span className="ta-meta-chip"><strong>Grade:</strong> {result.grade}</span>
                  )}
                  {result.totalMarks && (
                    <span className="ta-meta-chip"><strong>Total:</strong> {result.totalMarks} marks</span>
                  )}
                  {result.duration && (
                    <span className="ta-meta-chip"><strong>Duration:</strong> {result.duration}</span>
                  )}
                </div>

                {result.instructions && result.instructions.length > 0 && (
                  <div className="ta-form-card" style={{ marginBottom: 16 }}>
                    <h3>📋 Instructions</h3>
                    <ul style={{ paddingLeft: 18, fontSize: 13, color: '#94a3b8' }}>
                      {result.instructions.map((inst, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.questions.map((q, i) => (
                  <div className="ta-question-card" key={i}>
                    <div className="ta-question-top">
                      <div className="ta-q-number">
                        <span>{q.questionNumber || i + 1}</span>
                        Question {q.questionNumber || i + 1}
                      </div>
                      <div className="ta-q-meta">
                        {q.type && <span className="ta-q-type">{q.type}</span>}
                        {q.marks && <span className="ta-q-marks">{q.marks} marks</span>}
                        {q.difficulty && <span className={`ta-q-difficulty ${q.difficulty}`}>{q.difficulty}</span>}
                      </div>
                    </div>
                    <p className="ta-question-text">{q.question}</p>
                    <button className="ta-answer-toggle" onClick={() => toggleAnswer(i)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {expandedAnswers[i] ? 'Hide' : 'Show'} Answer Key
                    </button>
                    {expandedAnswers[i] && (
                      <div className="ta-answer-content">
                        <strong>Answer Key</strong>
                        {q.answerKey}
                        {q.rubric && (
                          <>
                            <br /><br />
                            <strong>Rubric</strong>
                            {q.rubric}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {/* --- Evaluate Results --- */}
            {resultAction === 'evaluate' && (
              <>
                <div className="ta-result-header">
                  <h2>📊 Evaluation Results</h2>
                </div>

                <div className="ta-eval-summary">
                  <div className="ta-eval-stat">
                    <div className="stat-value">{result.overallScore ?? '—'}/{result.totalMarks ?? '—'}</div>
                    <div className="stat-label">Score</div>
                  </div>
                  <div className="ta-eval-stat">
                    <div className="stat-value">{result.percentage ?? '—'}%</div>
                    <div className="stat-label">Percentage</div>
                  </div>
                  <div className="ta-eval-stat grade">
                    <div className="stat-value">{result.grade ?? '—'}</div>
                    <div className="stat-label">Grade</div>
                  </div>
                </div>

                {result.evaluations && result.evaluations.map((ev, i) => (
                  <div className="ta-question-card" key={i}>
                    <div className="ta-question-top">
                      <div className="ta-q-number">
                        <span>{ev.questionNumber || i + 1}</span>
                        Question {ev.questionNumber || i + 1}
                      </div>
                      <span className="ta-q-marks">{ev.marksAwarded}/{ev.maxMarks} marks</span>
                    </div>
                    <p className="ta-question-text">{ev.feedback}</p>
                    {ev.strength && (
                      <p style={{ fontSize: 13, color: '#4ade80', marginBottom: 4 }}>
                        ✅ <strong>Strength:</strong> {ev.strength}
                      </p>
                    )}
                    {ev.improvement && (
                      <p style={{ fontSize: 13, color: '#fbbf24' }}>
                        💡 <strong>Improve:</strong> {ev.improvement}
                      </p>
                    )}
                  </div>
                ))}

                {result.overallFeedback && (
                  <div className="ta-feedback-card">
                    <h4>📝 Overall Feedback</h4>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{result.overallFeedback}</p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {result.strengths && result.strengths.length > 0 && (
                    <div className="ta-feedback-card">
                      <h4>✅ Strengths</h4>
                      <ul>
                        {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {result.areasForImprovement && result.areasForImprovement.length > 0 && (
                    <div className="ta-feedback-card">
                      <h4>⚠️ Areas for Improvement</h4>
                      <ul>
                        {result.areasForImprovement.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="ta-feedback-card">
                    <h4>💡 Recommendations</h4>
                    <ul>
                      {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
              </>
            )}

            {/* --- Improve Results --- */}
            {resultAction === 'improve' && (
              <>
                <div className="ta-result-header">
                  <h2>🔬 Question Analysis</h2>
                </div>

                {result.analysis && (
                  <div className="ta-result-meta">
                    <span className="ta-meta-chip"><strong>Difficulty:</strong> {result.analysis.currentDifficulty}</span>
                    <span className="ta-meta-chip"><strong>Bloom&apos;s:</strong> {result.analysis.bloomsLevel}</span>
                    <span className="ta-meta-chip"><strong>Clarity:</strong> {result.analysis.clarity}/10</span>
                  </div>
                )}

                {result.analysis?.issues && result.analysis.issues.length > 0 && (
                  <div className="ta-feedback-card">
                    <h4>⚠️ Issues Found</h4>
                    <ul>
                      {result.analysis.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                    </ul>
                  </div>
                )}

                {result.improvedVersions && result.improvedVersions.map((v, i) => (
                  <div className="ta-improve-card" key={i}>
                    <h4>✨ Improved Version {i + 1}</h4>
                    <div className="ta-improve-version">
                      <div className="version-label">{v.difficulty} · {v.bloomsLevel}</div>
                      <div className="version-text">{v.version}</div>
                      {v.explanation && (
                        <div className="version-explanation">{v.explanation}</div>
                      )}
                    </div>
                  </div>
                ))}

                {result.markingScheme && (
                  <div className="ta-feedback-card">
                    <h4>📊 Suggested Marking Scheme</h4>
                    <p style={{ fontSize: 13, color: '#94a3b8' }}>
                      <strong style={{ color: '#e2e8f0' }}>Marks: {result.markingScheme.suggestedMarks}</strong>
                      <br />
                      {result.markingScheme.distribution}
                    </p>
                  </div>
                )}

                {result.tips && result.tips.length > 0 && (
                  <div className="ta-feedback-card">
                    <h4>💡 Teaching Tips</h4>
                    <ul>
                      {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Raw fallback */}
        {result && result.parseError && (
          <div className="ta-results">
            <div className="ta-result-header">
              <h2>📄 AI Response</h2>
            </div>
            <div className="ta-raw-result">{result.raw}</div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default TeacherAssistant;
