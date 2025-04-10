import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import SurveyForm from "./SurveyForm";
import { Add } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

type Question = {
  id: string;
  questionText: string;
  type: "text" | "multipleChoice";
  options?: { id: string; optionText: string }[];
};

type Survey = {
  id: string;
  title: string;
  questions: Question[];
};

const SurveyManager: React.FC = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [savedSurveys, setSavedSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const surveyData = localStorage.getItem("survey_data"); // 저장된 설문 불러오기
    if (surveyData) {
      try {
        const parsedSurveys: Survey[] = JSON.parse(surveyData);
        setSavedSurveys(parsedSurveys);
      } catch (error) {
        console.error(
          "로컬스토리지에서 데이터를 파싱하는 데 실패했습니다:",
          error
        );
        // 파싱에 실패하면 기본 설문 데이터를 유지하거나, 오류 처리 로직을 추가할 수 있습니다.
      }
    }
  }, []);

  // 로컬스토리지에 데이터를 저장하는 함수
  const saveSurveysToLocalStorage = (surveys: Survey[]) => {
    try {
      const serializedData = JSON.stringify(surveys);
      localStorage.setItem("survey_data", serializedData);
    } catch (error) {
      console.error("로컬스토리지에 데이터를 저장하는 데 실패했습니다:", error);
    }
  };

  const createNewSurvey = () => {
    const newSurvey: Survey = {
      id: String(Date.now()),
      title: "NO TITLE",
      questions: [],
    };

    const updatedSurveys = [...savedSurveys, newSurvey];
    setSavedSurveys(updatedSurveys);
    saveSurveysToLocalStorage(updatedSurveys); // 로컬스토리지에 저장
  };

  const handleDeleteSurvey = (id: string) => {
    const updatedSurveys = savedSurveys.filter((survey) => survey.id !== id);
    setSavedSurveys(updatedSurveys);
    saveSurveysToLocalStorage(updatedSurveys);
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 1000, margin: "auto", marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        SURVEYS
      </Typography>
      {!selectedSurvey ? (
        <>
          <List sx={{ listStyleType: "disc" }}>
            {savedSurveys?.map((survey) => (
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pl: 0,
                }}
                style={{ cursor: "pointer", listStyleType: "disc" }}
                // button
                key={survey.id}
                onClick={() => setSelectedSurvey(survey)}
              >
                <ListItemText primary={survey.title} />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation(); // 클릭이 부모로 전파되지 않게
                    handleDeleteSurvey(survey.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => {
              createNewSurvey();
            }}
          >
            Add survey
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => setSelectedSurvey(null)}>
            Return to Survey List
          </Button>
          <SurveyForm
            initialData={selectedSurvey}
            onSave={(newSurvey) => {
              const updatedSurveys = savedSurveys.map((s) =>
                s.id === newSurvey.id ? newSurvey : s
              );
              setSavedSurveys(updatedSurveys);
              saveSurveysToLocalStorage(updatedSurveys);
              setSelectedSurvey(null); // 목록으로 이동
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default SurveyManager;
