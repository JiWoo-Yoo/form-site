import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import {
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Paper,
} from "@mui/material";
import { Add, Remove, ZoomIn } from "@mui/icons-material";
import OptionsField from "./OptionsField";
import ToastPopup from "./ToastPopup";

type Option = {
  id: string;
  optionText: string;
};

type Question = {
  id: string;
  questionText: string;
  type: "text" | "multipleChoice";
  options?: Option[];
};

type FormValues = {
  id: string;
  title: string;
  questions: Question[];
};

type SurveyFormProps = {
  initialData?: FormValues;
  onSave?: (savedSurvey: Survey) => void;
};

type Survey = {
  id: string;
  title: string;
  questions: Question[];
};

const SurveyForm: React.FC<SurveyFormProps> = ({ initialData, onSave }) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialData || {
      title: "",
      questions: [
        {
          id: "",
          questionText: "",
          type: "text",
          options: [{ id: "", optionText: "" }],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  // 각 질문의 수정 모드를 관리하는 상태
  const [editMode, setEditMode] = useState<Set<number>>(new Set());

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // 토스트 닫기 함수
  const handleToastClose = () => {
    setToastOpen(false);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newSurvey: Survey = {
      id: initialData?.id || String(Date.now()),
      title: data.title,
      questions: data.questions,
    };

    let surveyList: Survey[] = [];
    const localData = localStorage.getItem("survey_data");
    if (localData) {
      try {
        surveyList = JSON.parse(localData);
      } catch (error) {
        console.error("로컬스토리지 파싱 실패:", error);
      }
    }

    const updatedSurveys = initialData
      ? surveyList.map((s) => (s.id === newSurvey.id ? newSurvey : s))
      : [...surveyList, newSurvey];

    localStorage.setItem("survey_data", JSON.stringify(updatedSurveys));
    if (onSave) onSave(newSurvey);
    reset();
    // ✅ 저장 성공 시 토스트 띄우기
    setToastMessage("설문이 저장되었습니다!");
    setToastOpen(true);
  };

  const toggleEditMode = (index: number) => {
    setEditMode((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 800, margin: "auto", marginTop: 4 }}>
      <ToastPopup
        open={toastOpen}
        message={toastMessage}
        onClose={handleToastClose}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 설문 제목 */}
        <TextField
          label="Survey title"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("title", { required: "The survey title is required." })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        {/* 동적 질문 */}
        {fields.map((field, index) => {
          const type = watch(`questions.${index}.type`); // 💡 실시간 감지
          return (
            <Paper
              key={field.id}
              sx={{ padding: 2, marginBottom: 2, position: "relative" }}
              variant="outlined"
            >
              <Typography variant="h6">Q{index + 1}</Typography>
              {/* 질문 삭제 버튼 */}
              <IconButton
                onClick={() => remove(index)}
                sx={{ position: "absolute", top: 8, right: 8 }}
                color="error"
                aria-label="Remove question"
              >
                <Remove />
              </IconButton>
              <>
                {/* 질문 내용 */}
                <TextField
                  label="Question content"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...register(`questions.${index}.questionText` as const, {
                    required: "Questions are required.",
                  })}
                  error={!!errors.questions?.[index]?.questionText}
                  helperText={errors.questions?.[index]?.questionText?.message}
                />

                {/* 질문 유형 */}
                <TextField
                  select
                  label="Question type"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  defaultValue="text"
                  {...register(`questions.${index}.type` as const)}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="multipleChoice">Multiple choice</MenuItem>
                </TextField>

                {/* 객관식 옵션 */}
                {type === "multipleChoice" && (
                  <OptionsField
                    nestIndex={index}
                    {...{ control, register, errors }}
                  />
                )}
              </>
            </Paper>
          );
        })}

        {/* 질문 추가 버튼 */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              minWidth: "40px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() =>
              append({
                id: "",
                questionText: "",
                type: "text",
                options: [{ id: "", optionText: "" }],
              })
            }
          >
            <Add />
          </Button>
        </div>

        {/* 저장 버튼 */}
        <div style={{ textAlign: "right" }}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            Save
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default SurveyForm;
