import React, { createContext, useContext, useState, ReactNode } from "react";
import { api } from "@/utils/api";

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
      const response = await api.post("/ai/questions", { niche, contentType });

      if (response.success) {
        setQuestions(response.data.questions || []);
        setSelectedQuestions(response.data.questions || []);
      } else {
        throw new Error("Failed to generate questions");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      setQuestions([]);
      setSelectedQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    setLoading(true);
    try {
      const response = await api.post("/ai/content", {
        niche,
        contentType,
        selectedQuestions: [...selectedQuestions, ...customQuestions],
      });

      if (response.success) {
        setScript(response.data.script || "");
        setVideoUrl(response.data.video_url || "");
      } else {
        throw new Error("Failed to generate content");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setScript("");
      setVideoUrl("");
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
