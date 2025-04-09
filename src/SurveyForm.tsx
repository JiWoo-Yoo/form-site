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
import { Add, Remove, Edit, Save, Cancel } from "@mui/icons-material";
import OptionsField from "./OptionsField";

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
  title: string;
  questions: Question[];
};

type SurveyFormProps = {
  initialData?: FormValues; // 초기 데이터가 있는 경우
};

type Survey = {
  id: string;
  title: string;
  questions: Question[];
};

const SurveyForm: React.FC<SurveyFormProps> = ({ initialData }) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
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

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("설문 저장: ", data);
    const dataList = [];
    const localData = localStorage.getItem("survey_data");
    if (localData) {
      try {
        const parsedSurveys: Survey[] = JSON.parse(localData);
        dataList.push(parsedSurveys);
      } catch (error) {
        console.error(
          "로컬스토리지에서 데이터를 파싱하는 데 실패했습니다:",
          error
        );
        // 파싱에 실패하면 기본 설문 데이터를 유지하거나, 오류 처리 로직을 추가할 수 있습니다.
      }
    }
    // 여기서 데이터를 백엔드로 전송하거나 다른 처리를 할 수 있습니다.
    dataList.push(data);
    localStorage.setItem("survey_data", JSON.stringify(dataList));
    reset(); // 제출 후 폼 초기화는 필요에 따라
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
      <Typography variant="h4" gutterBottom>
        {initialData ? "설문 수정" : "설문 작성"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 설문 제목 */}
        <TextField
          label="설문 제목"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("title", { required: "설문 제목은 필수입니다." })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        {/* 동적 질문 */}
        {fields.map((field, index) => (
          <Paper
            key={field.id}
            sx={{ padding: 2, marginBottom: 2, position: "relative" }}
            variant="outlined"
          >
            <Typography variant="h6">질문 {index + 1}</Typography>
            {/* 질문 삭제 버튼 */}
            <IconButton
              onClick={() => remove(index)}
              sx={{ position: "absolute", top: 8, right: 8 }}
              color="error"
              aria-label="질문 삭제"
            >
              <Remove />
            </IconButton>

            {/* 수정/저장 버튼 */}
            <IconButton
              onClick={() => toggleEditMode(index)}
              sx={{ position: "absolute", top: 8, right: 40 }}
              color="primary"
              aria-label={editMode.has(index) ? "저장" : "수정"}
            >
              {editMode.has(index) ? <Save /> : <Edit />}
            </IconButton>

            {editMode.has(index) ? (
              // 수정 모드일 때 질문 내용과 유형을 입력할 수 있는 필드
              <>
                {/* 질문 내용 */}
                <TextField
                  label="질문 내용"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...register(`questions.${index}.questionText` as const, {
                    required: "질문 내용은 필수입니다.",
                  })}
                  error={!!errors.questions?.[index]?.questionText}
                  helperText={errors.questions?.[index]?.questionText?.message}
                />

                {/* 질문 유형 */}
                <TextField
                  select
                  label="질문 유형"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  defaultValue="text"
                  {...register(`questions.${index}.type` as const)}
                >
                  <MenuItem value="text">텍스트</MenuItem>
                  <MenuItem value="multipleChoice">객관식</MenuItem>
                </TextField>

                {/* 객관식 옵션 */}
                {field.type === "multipleChoice" && (
                  <OptionsField
                    nestIndex={index}
                    {...{ control, register, errors }}
                  />
                )}
              </>
            ) : (
              // 조회 모드일 때 질문 내용을 표시
              <>
                <Typography variant="subtitle1">
                  <strong>질문 내용:</strong> {field.questionText}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>질문 유형:</strong>{" "}
                  {field.type === "text" ? "텍스트" : "객관식"}
                </Typography>
                {field.type === "multipleChoice" && field.options && (
                  <Typography variant="subtitle1">
                    <strong>옵션:</strong>{" "}
                    {field.options.map((opt) => opt.optionText).join(", ")}
                  </Typography>
                )}
              </>
            )}
          </Paper>
        ))}

        {/* 질문 추가 버튼 */}
        {editMode.size === 0 && ( // 전체 작성 폼이 아닌 개별 수정 모드일 때만 질문 추가 가능
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() =>
              append({
                id: "",
                questionText: "",
                type: "text",
                options: [{ id: "", optionText: "" }],
              })
            }
          >
            질문 추가
          </Button>
        )}

        {/* 제출 버튼 */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2, marginLeft: 2 }}
        >
          {initialData ? "설문 수정 저장" : "설문 제출"}
        </Button>
      </form>
    </Paper>
  );
};

export default SurveyForm;
