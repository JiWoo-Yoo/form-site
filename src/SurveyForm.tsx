import React from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import {
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  MenuItem,
  Paper,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import OptionsField from "./OptionsField";

type Question = {
  questionText: string;
  type: "text" | "multipleChoice";
  options?: { optionText: string }[];
};

type FormValues = {
  title: string;
  questions: Question[];
};

const SurveyForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      questions: [
        {
          questionText: "",
          type: "text",
          options: [{ optionText: "" }], // 객관식의 경우 옵션
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("설문 데이터: ", data);
    // 데이터는 백엔드로 전송하거나 필요에 따라 처리
    reset(); // 제출 후 폼 초기화
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 800, margin: "auto", marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        설문 작성
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
        {fields.map((field, index) => {
          return (
            <Paper
              key={field.id}
              sx={{ padding: 2, marginBottom: 2, position: "relative" }}
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
            </Paper>
          );
        })}

        {/* 질문 추가 버튼 */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            append({
              questionText: "",
              type: "text",
              options: [{ optionText: "" }],
            })
          }
        >
          질문 추가
        </Button>

        {/* 제출 버튼 */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2, marginLeft: 2 }}
        >
          설문 제출
        </Button>
      </form>
    </Paper>
  );
};

export default SurveyForm;
