// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  // 필요에 따라 테마를 커스터마이징하세요.
  palette: {
    primary: {
      // main: "#1976d2",
      // main: "#E8338B",
      main: "#df6174",
      // main: "#7f12c3",
    },
    secondary: {
      // main: "#dc004e",
      main: "#000",
    },
  },
  typography: {
    fontFamily: `'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans KR', sans-serif`,
  },
});

export default theme;
