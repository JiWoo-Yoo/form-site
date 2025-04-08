import React from "react";
import { useFieldArray, Control } from "react-hook-form";
import { TextField, IconButton, Grid, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

type Option = {
  optionText: string;
};

type Props = {
  nestIndex: number;
  control: Control<any>;
  register: any;
  errors: any;
};

const OptionsField: React.FC<Props> = ({
  nestIndex,
  control,
  register,
  errors,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${nestIndex}.options`,
  });

  return (
    <div>
      <Typography variant="subtitle1">옵션</Typography>
      {fields.map((field, k) => (
        <Grid container alignItems="center" key={field.id} spacing={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={`옵션 ${k + 1}`}
              variant="outlined"
              fullWidth
              margin="normal"
              {...register(
                `questions.${nestIndex}.options.${k}.optionText` as const,
                {
                  required: "옵션 내용은 필수입니다.",
                }
              )}
              error={!!errors.questions?.[nestIndex]?.options?.[k]?.optionText}
              helperText={
                errors.questions?.[nestIndex]?.options?.[k]?.optionText?.message
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <IconButton
              onClick={() => remove(k)}
              color="error"
              aria-label="옵션 삭제"
              sx={{ marginTop: 2 }}
            >
              <Remove />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <IconButton
        onClick={() => append({ optionText: "" })}
        color="primary"
        aria-label="옵션 추가"
      >
        <Add />
      </IconButton>
    </div>
  );
};

export default OptionsField;
