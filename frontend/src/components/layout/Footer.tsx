
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        padding: '16px',
        textAlign: 'center',
        marginTop: 'auto'
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} My Website. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
