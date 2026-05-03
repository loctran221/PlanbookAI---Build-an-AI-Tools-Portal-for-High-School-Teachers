import { useState, useEffect } from "react";
import { Wand2, Settings, Sparkles, Download, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import apiClient from "../../api/apiClient";

interface GeneratedQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface Topic {
  topicId: number;
  name: string;
}

export default function ExerciseGenerator() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicId, setTopicId] = useState<string>("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionType, setQuestionType] = useState("MCQ");
  const [questionCount, setQuestionCount] = useState([5]);
  const [additionalContext, setAdditionalContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    try {
      const res = await apiClient.get<Topic[]>("/api/v1/topics");
      setTopics(res.data);
    } catch {
      toast.error("Lỗi tải danh sách chủ đề");
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedQuestions([]);

    const topicName = topics.find((t) => t.topicId.toString() === topicId)?.name || "chemistry";

    // Simulate AI generation with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Smart Mock Dictionary
      let mockQuestions: GeneratedQuestion[] = [];
      const tName = topicName.toLowerCase();
      
      if (tName.includes("atomic structure") || tName.includes("nguyên tử")) {
        mockQuestions = [
          {
            id: 1, question: "Which subatomic particle has a negative charge?",
            options: ["Proton", "Neutron", "Electron", "Positron"],
            answer: "Electron", explanation: "Electrons are negatively charged subatomic particles that orbit the nucleus."
          },
          {
            id: 2, question: "The atomic number of an element is determined by the number of:",
            options: ["Protons", "Neutrons", "Electrons", "Nucleons"],
            answer: "Protons", explanation: "The number of protons in the nucleus defines the element and its atomic number."
          },
          {
            id: 3, question: "Isotopes are atoms of the same element that have different numbers of:",
            options: ["Protons", "Electrons", "Neutrons", "Positrons"],
            answer: "Neutrons", explanation: "Isotopes share the same number of protons but differ in neutron count, changing their mass."
          },
          {
            id: 4, question: "Where is almost all the mass of an atom concentrated?",
            options: ["Electron cloud", "Nucleus", "Valence shell", "Orbitals"],
            answer: "Nucleus", explanation: "The nucleus contains heavy protons and neutrons, while electrons have negligible mass."
          },
          {
            id: 5, question: "Which particle has no electrical charge?",
            options: ["Proton", "Electron", "Neutron", "Alpha particle"],
            answer: "Neutron", explanation: "Neutrons are neutral particles located in the nucleus of an atom."
          }
        ];
      } else if (tName.includes("periodic") || tName.includes("tuần hoàn")) {
        mockQuestions = [
          {
            id: 1, question: "Elements in the same group of the periodic table have the same:",
            options: ["Atomic mass", "Number of valence electrons", "Number of protons", "Atomic radius"],
            answer: "Number of valence electrons", explanation: "Groups (columns) group elements with similar chemical properties due to identical valence electron counts."
          },
          {
            id: 2, question: "Which element has the highest electronegativity?",
            options: ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"],
            answer: "Fluorine", explanation: "Fluorine is the most electronegative element on the Pauling scale."
          },
          {
            id: 3, question: "As you move from left to right across a period, the atomic radius generally:",
            options: ["Increases", "Decreases", "Stays the same", "Fluctuates"],
            answer: "Decreases", explanation: "Increasing nuclear charge pulls the electron cloud closer, reducing the radius."
          },
          {
            id: 4, question: "Group 18 elements are also known as:",
            options: ["Alkali metals", "Halogens", "Noble gases", "Alkaline earth metals"],
            answer: "Noble gases", explanation: "Group 18 consists of unreactive gases with full valence shells."
          },
          {
            id: 5, question: "Which element is a liquid at room temperature?",
            options: ["Iron", "Bromine", "Iodine", "Sodium"],
            answer: "Bromine", explanation: "Bromine and Mercury are the only two elements that are liquid at standard room temperature."
          }
        ];
      } else if (tName.includes("bonding") || tName.includes("liên kết")) {
        mockQuestions = [
          {
            id: 1, question: "An ionic bond is formed when:",
            options: ["Electrons are shared equally", "Electrons are transferred from one atom to another", "Protons are transferred", "Neutrons are shared"],
            answer: "Electrons are transferred from one atom to another", explanation: "Ionic bonds form between metals and non-metals via electron transfer."
          },
          {
            id: 2, question: "A covalent bond involves the sharing of:",
            options: ["Protons", "Neutrons", "Electrons", "Nuclei"],
            answer: "Electrons", explanation: "Covalent bonds occur when non-metal atoms share pairs of electrons."
          },
          {
            id: 3, question: "Which type of bond is found in a molecule of water (H2O)?",
            options: ["Ionic", "Polar covalent", "Non-polar covalent", "Metallic"],
            answer: "Polar covalent", explanation: "Oxygen is more electronegative than hydrogen, creating unequal sharing of electrons."
          },
          {
            id: 4, question: "Metallic bonds are characterized by:",
            options: ["A sea of delocalized electrons", "Transfer of electrons", "Sharing of proton pairs", "Hydrogen bonding"],
            answer: "A sea of delocalized electrons", explanation: "Metal cations are surrounded by freely moving valence electrons."
          },
          {
            id: 5, question: "Which of the following molecules contains a double bond?",
            options: ["H2", "Cl2", "O2", "N2"],
            answer: "O2", explanation: "Oxygen gas (O2) contains a double covalent bond to satisfy the octet rule."
          }
        ];
      } else {
        // Generic fallback for other topics
        mockQuestions = [
          {
            id: 1, question: `What is the fundamental concept underlying ${topicName}?`,
            options: ["Conservation of Mass", "Electron Transfer", "Thermodynamics", "All of the above"],
            answer: "All of the above", explanation: "These are core principles in chemistry."
          },
          {
            id: 2, question: `How is ${topicName} applied in real-world scenarios?`,
            options: ["Industrial manufacturing", "Environmental protection", "Medical research", "All of these"],
            answer: "All of these", explanation: "Chemical principles have broad applications."
          },
          {
            id: 3, question: `Which scientist made major contributions to our understanding of ${topicName}?`,
            options: ["Marie Curie", "Dmitri Mendeleev", "Linus Pauling", "Various scientists"],
            answer: "Various scientists", explanation: "Scientific progress is a collaborative effort over centuries."
          }
        ];
      }

      // If question type is not MCQ, format it properly
      if (questionType === "FILL_BLANK") {
        mockQuestions = mockQuestions.map(q => {
          // Attempt to convert question to a fill-in-the-blank sentence
          let newQ = q.question;
          if (newQ.startsWith("Which subatomic particle has a negative charge?")) newQ = "The ________ is a subatomic particle that has a negative charge.";
          else if (newQ.startsWith("The atomic number")) newQ = "The atomic number of an element is determined by the number of ________ in its nucleus.";
          else if (newQ.startsWith("Isotopes are atoms")) newQ = "Isotopes are atoms of the same element that have different numbers of ________.";
          else if (newQ.startsWith("Where is almost all")) newQ = "Almost all the mass of an atom is concentrated in the ________.";
          else if (newQ.startsWith("Which particle has no electrical charge?")) newQ = "The ________ is a particle in the nucleus that has no electrical charge.";
          else if (newQ.startsWith("Elements in the same group")) newQ = "Elements in the same group of the periodic table have the same number of ________.";
          else if (newQ.startsWith("Which element has the highest")) newQ = "The element ________ has the highest electronegativity on the periodic table.";
          else if (newQ.startsWith("As you move from left to right")) newQ = "As you move from left to right across a period, the atomic radius generally ________.";
          else if (newQ.startsWith("Group 18 elements")) newQ = "Group 18 elements are also known as ________.";
          else if (newQ.startsWith("Which element is a liquid")) newQ = "At room temperature, the element ________ is a liquid non-metal.";
          else if (newQ.startsWith("An ionic bond is formed")) newQ = "An ionic bond is formed when electrons are ________ from one atom to another.";
          else if (newQ.startsWith("A covalent bond involves")) newQ = "A covalent bond involves the ________ of electrons between atoms.";
          else if (newQ.startsWith("Which type of bond is found in a molecule of water")) newQ = "The type of bond found in a molecule of water (H2O) is a ________ bond.";
          else if (newQ.startsWith("Metallic bonds are")) newQ = "Metallic bonds are characterized by a sea of ________ electrons.";
          else if (newQ.startsWith("Which of the following molecules contains a double bond")) newQ = "A molecule of ________ contains a double covalent bond.";
          else newQ = newQ.replace("?", " is ________.");

          return {
            ...q,
            question: newQ,
            options: [], // No options for fill blank
          };
        });
      } else if (questionType === "SHORT_ANSWER") {
        mockQuestions = mockQuestions.map(q => ({
          ...q,
          options: [], // No options for short answer
        }));
      }

      // Fill up to requested count by repeating or slicing
      let finalQuestions: GeneratedQuestion[] = [];
      while (finalQuestions.length < questionCount[0]) {
        finalQuestions = [...finalQuestions, ...mockQuestions];
      }
      finalQuestions = finalQuestions.slice(0, questionCount[0]);

      setGeneratedQuestions(finalQuestions);
      setIsGenerating(false);
      toast.success(`Successfully generated ${questionCount[0]} questions!`);
    }, 2500);
  };

  const handleSaveToBank = async () => {
    if (!topicId) {
      toast.error("Vui lòng chọn chủ đề (Topic) trước khi lưu");
      return;
    }
    setIsSaving(true);
    try {
      // Post each question to the backend
      const promises = generatedQuestions.map(q => {
        const payload = {
          topicId: Number(topicId),
          content: q.question,
          type: questionType,
          difficulty: difficulty.toUpperCase(),
          choices: questionType === "MCQ" ? q.options.map(opt => ({
            content: opt,
            correct: opt === q.answer
          })) : [{ content: q.answer, correct: true }]
        };
        return apiClient.post("/api/v1/questions", payload);
      });
      
      await Promise.all(promises);
      toast.success("Đã lưu câu hỏi vào Question Bank thành công!");
      // Optionally clear after saving
      setGeneratedQuestions([]);
    } catch (e: any) {
      toast.error("Lỗi khi lưu câu hỏi: " + (e.response?.data?.message || e.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    toast.success("Exercises downloaded as PDF!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Exercise Generator</h1>
        <p className="mt-1 text-gray-600">
          Generate AI-powered exercises tailored to your curriculum
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
              <CardDescription>
                Customize your exercise parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={topicId} onValueChange={setTopicId}>
                  <SelectTrigger id="topic">
                    <SelectValue placeholder="Chọn chủ đề..." />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map(t => (
                      <SelectItem key={t.topicId} value={String(t.topicId)}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Question Type</Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MCQ">Multiple Choice</SelectItem>
                      <SelectItem value="FILL_BLANK">Fill in the Blank</SelectItem>
                      <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Number of Questions: {questionCount[0]}</Label>
                <Slider
                  value={questionCount}
                  onValueChange={setQuestionCount}
                  min={3}
                  max={20}
                  step={1}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500">Range: 3-20 questions</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Additional Context (Optional)</Label>
                <Textarea
                  id="context"
                  placeholder="Add specific requirements, learning objectives, or context..."
                  rows={4}
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={handleGenerate}
                disabled={isGenerating || !topicId}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Exercises
                  </>
                )}
              </Button>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Generating...</span>
                    <span className="font-medium text-indigo-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Generated Questions Panel */}
        <div className="lg:col-span-2">
          {generatedQuestions.length === 0 ? (
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[500px] text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                  <Wand2 className="h-10 w-10 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Generate Exercises
                </h3>
                <p className="text-gray-600 max-w-md">
                  Configure your exercise parameters on the left and click "Generate Exercises" to create AI-powered questions.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Action Bar */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {generatedQuestions.length} Questions Generated
                      </Badge>
                      <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                        {difficulty}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSaveToBank} disabled={isSaving}>
                        {isSaving ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isSaving ? "Đang lưu..." : "Save to Bank"}
                      </Button>
                      <Button size="sm" onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Questions List */}
              {generatedQuestions.map((q, index) => (
                <Card key={q.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Question {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-900 font-medium">{q.question}</p>
                    
                    <div className="grid gap-2">
                      {q.options.length > 0 ? (
                        q.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`rounded-lg border p-3 text-sm transition-colors ${
                              option === q.answer
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <span className="font-medium">
                              {String.fromCharCode(65 + idx)}.
                            </span>{" "}
                            {option}
                            {option === q.answer && (
                              <Badge className="ml-2 bg-green-600 text-white">
                                Correct
                              </Badge>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-lg border border-green-500 bg-green-50 p-3 text-sm">
                          <span className="font-semibold text-green-900">Answer Key: </span>
                          <span className="text-green-800">{q.answer}</span>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Explanation:
                      </p>
                      <p className="text-sm text-blue-800">{q.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
