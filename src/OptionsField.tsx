import React from "react";
import { useFieldArray, Control } from "react-hook-form";
import { TextField, IconButton, Typography, Button, Box } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

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
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="subtitle1">Option</Typography>
      {fields.map((field, k) => (
        <Box
          key={field.id}
          sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
        >
          <TextField
            label={`Option ${k + 1}`}
            variant="outlined"
            {...register(
              `questions.${nestIndex}.options.${k}.optionText` as const,
              {
                required: "Optional content is required.",
              }
            )}
            error={!!errors.questions?.[nestIndex]?.options?.[k]?.optionText}
            helperText={
              errors.questions?.[nestIndex]?.options?.[k]?.optionText?.message
            }
            fullWidth
          />
          <IconButton
            onClick={() => remove(k)}
            color="error"
            aria-label="Remove option"
          >
            <Remove />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={() => append({ id: "", optionText: "" })}
      >
        Add Option
      </Button>
    </Box>
  );
};

export default OptionsField;
