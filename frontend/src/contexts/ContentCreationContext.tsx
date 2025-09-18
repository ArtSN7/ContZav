import React, { createContext, useContext, useState, ReactNode } from "react";

interface ContentCreationContextType {
  niche: string;
  setNiche: (niche: string) => void;
  contentType: "video" | "text" | "combination";
  setContentType: (type: "video" | "text" | "combination") => void;
  questions: string[];
  setQuestions: (questions: string[]) => void;
  selectedQuestions: string[];
  setSelectedQuestions: (questions: string[]) => void;
  customQuestions: string[];
  setCustomQuestions: (questions: string[]) => void;
  script: string;
  setScript: (script: string) => void;
  videoUrl?: string;
  setVideoUrl: (url: string) => void;
  loading: boolean;
  generateQuestions: () => Promise<void>;
  generateContent: () => Promise<void>;
  addCustomQuestion: (question: string) => void;
  removeCustomQuestion: (index: number) => void;
  reset: () => void;
}

const ContentCreationContext = createContext<
  ContentCreationContextType | undefined
>(undefined);

export const useContentCreation = () => {
  const context = useContext(ContentCreationContext);
  if (!context) {
    throw new Error(
      "useContentCreation must be used within a ContentCreationProvider"
    );
  }
  return context;
};

interface ContentCreationProviderProps {
  children: ReactNode;
}

export const ContentCreationProvider: React.FC<
  ContentCreationProviderProps
> = ({ children }) => {
  const [niche, setNiche] = useState("");
  const [contentType, setContentType] = useState<
    "video" | "text" | "combination"
  >("video");
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [script, setScript] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    if (!niche.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        "http://localhost:5090/api/ai/generate-questions/mock",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ niche, contentType }),
        }
      );

      console.log(response);

      if (!response.ok) throw new Error("Failed to generate questions");

      const data = await response.json();
      setQuestions(data.questions);
      setSelectedQuestions(data.questions);
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (!niche.trim() || selectedQuestions.length === 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        "http://localhost:5090/api/ai/generate-content/mock",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            niche,
            contentType,
            selectedQuestions: [...selectedQuestions, ...customQuestions],
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate content");

      const content = await response.json();
      setScript(content.script);
      setVideoUrl(content.video_url);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomQuestion = (question: string) => {
    if (question.trim()) {
      setCustomQuestions((prev) => [...prev, question.trim()]);
    }
  };

  const removeCustomQuestion = (index: number) => {
    setCustomQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setNiche("");
    setContentType("video");
    setQuestions([]);
    setSelectedQuestions([]);
    setCustomQuestions([]);
    setScript("");
    setVideoUrl("");
  };

  const value: ContentCreationContextType = {
    niche,
    setNiche,
    contentType,
    setContentType,
    questions,
    setQuestions,
    selectedQuestions,
    setSelectedQuestions,
    customQuestions,
    setCustomQuestions,
    script,
    setScript,
    videoUrl,
    setVideoUrl,
    loading,
    generateQuestions,
    generateContent,
    addCustomQuestion,
    removeCustomQuestion,
    reset,
  };

  return (
    <ContentCreationContext.Provider value={value}>
      {children}
    </ContentCreationContext.Provider>
  );
};
