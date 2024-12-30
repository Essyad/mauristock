import { createTheme } from '@mui/material/styles';
import { Roboto } from '@mui/material/styles/createTypography';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

export default theme; 