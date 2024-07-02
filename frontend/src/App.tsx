import './App.css';
import { SetStateAction, useState } from 'react';
import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import axios from 'axios';

interface queryResponseType {
  OLAP: { dices: string; rollUps: string; slices: string };
  queryStringInterpolation: string;
  results: string;
}

const App = () =>{
  const [inputText, setInputText] = useState<string>('');
  const [inputRes, setInputRes] = useState<string>('');
  const [resSeverity, setResSeverity] = useState<'success' | 'error' | undefined>();
  const [query, setQuery] = useState<queryResponseType | undefined>();

  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Send a POST request
    await axios
      .post('http://localhost:8081/input', { inputText })
      .then(res => {
        const { status, data } = res;
        status === 200 && setInputRes('sent successfully');
        setResSeverity('success');
        console.log('response', data);
        setOpenSnackBar(true);
        setQuery(data);
      })
      .catch(err => {
        typeof err === 'string' && setInputRes(err);
        setResSeverity('error');
      });

    setInputText('');
  };

  console.log('...query', query);

  const handleCloseSnackBar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  const handleInput = (e: { target: { value: SetStateAction<string> } }) => {
    setInputText(e.target.value);
  };

  return (
    <Box
      sx={{
        background: '#051942',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography> Enter your query below</Typography>
        <TextField
          id="outlined-basic"
          multiline
          value={inputText}
          onChange={handleInput}
          label="Outlined"
          variant="outlined"
          maxRows={4}
          InputProps={{ sx: { color: 'white', border: '1px solid white', '& #outlined-basic': { borderColor: 'white' } } }}
          InputLabelProps={{ sx: { display: 'none' } }}
          sx={{ width: '30rem' }}
        />
        <Button variant="outlined" type="submit" sx={{ alignSelf: 'flex-end', mt: 2 }} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      {query && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8rem', width: '50rem', mt: '5rem' }}>
          <Box sx={{}}>
            <Typography variant="h4">OLAP Operations</Typography>
            {query.OLAP.rollUps !== '' && (
              <>
                <Typography variant="h6" sx={{ fontStyle: 'italic', mt: 1, fontWeight: '700' }}>
                  ROLL UP:
                </Typography>
                <Typography sx={{ fontStyle: 'italic', mt: 1 }}>{query.OLAP.rollUps}</Typography>
              </>
            )}
            {query.OLAP.dices !== '' && (
              <>
                <Typography variant="h6" sx={{ fontStyle: 'italic', mt: 1, fontWeight: '700' }}>
                  DICE:
                </Typography>
                <Typography sx={{ fontStyle: 'italic', mt: 1 }}>{query.OLAP.dices}</Typography>
              </>
            )}
            {query.OLAP.slices !== '' && (
              <>
                <Typography variant="h6" sx={{ fontStyle: 'italic', mt: 1, fontWeight: '700' }}>
                  SLICE:
                </Typography>
                <Typography sx={{ fontStyle: 'italic', mt: 1 }}>{query.OLAP.slices}</Typography>
              </>
            )}
          </Box>
          <Box sx={{}}>
            <Typography variant="h4">Query</Typography>
            <Typography sx={{ fontStyle: 'italic', mt: 1 }}>{query.queryStringInterpolation}</Typography>
          </Box>
          <Box sx={{}}>
            <Typography variant="h4">Count:</Typography>
            <Typography variant="h5" sx={{ fontStyle: 'italic', mt: 1 }}>
              {query.results}
            </Typography>
          </Box>
        </Box>
      )}

      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity={resSeverity} sx={{ width: '100%' }}>
          {inputRes}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
