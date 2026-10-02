import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { homePageText } from '../constants/homePageText';

export function HomeHero() {
    return (
        <HeroPanel variant="outlined">
            <HeroContent>
                <Stack direction="row" alignItems="center" gap={1}>
                    <EyebrowDot />
                    <EyebrowText>{homePageText.hero.eyebrow}</EyebrowText>
                </Stack>
                <HeroTitle>{homePageText.hero.title}</HeroTitle>
                <HeroDescription>{homePageText.hero.description}</HeroDescription>
                <GlobalSearch
                    disabled
                    placeholder={homePageText.hero.searchPlaceholder}
                    inputProps={{ 'aria-label': homePageText.hero.searchAriaLabel }}
                    InputProps={{
                        startAdornment: (
                            <SearchRoundedIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                        ),
                    }}
                />
            </HeroContent>
            <HeroVisual>
                <HeroVisualCircle />
                <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {homePageText.hero.visualTitle}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                    {homePageText.hero.visualDescription}
                </Typography>
            </HeroVisual>
        </HeroPanel>
    );
}

const HeroPanel = styled(Paper)(({ theme }) => ({
    display: 'flex',
    minHeight: 330,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
    padding: theme.spacing(2.75),
    borderRadius: '16px',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('md')]: {
        minHeight: 300,
        padding: theme.spacing(5),
        borderRadius: '20px',
    },
}));

const HeroContent = styled(Stack)(({ theme }) => ({
    maxWidth: 620,
    gap: theme.spacing(1.5),
    [theme.breakpoints.up('md')]: { gap: theme.spacing(2.25) },
}));

const EyebrowDot = styled(Box)(({ theme }) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
}));

const EyebrowText = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: 11,
    fontWeight: 600,
    [theme.breakpoints.up('md')]: { fontSize: 12 },
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1.45,
    [theme.breakpoints.up('md')]: { fontSize: 36 },
}));

const HeroDescription = styled(Typography)(({ theme }) => ({
    maxWidth: 620,
    color: theme.palette.text.secondary,
    fontSize: 13,
    lineHeight: 1.45,
    [theme.breakpoints.up('md')]: { fontSize: 16 },
}));

const GlobalSearch = styled(TextField)(({ theme }) => ({
    width: '100%',
    '& .MuiOutlinedInput-root': { height: 50 },
    '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.secondary },
    [theme.breakpoints.up('md')]: { width: 620, '& .MuiOutlinedInput-root': { height: 52 } },
}));

const HeroVisual = styled(Stack)(({ theme }) => ({
    display: 'none',
    width: 300,
    height: 196,
    flex: '0 0 auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
    borderRadius: '16px',
    backgroundColor: theme.interviewly.surfaces.primarySubtle,
    [theme.breakpoints.up('md')]: { display: 'flex' },
}));

const HeroVisualCircle = styled(Box)(({ theme }) => ({
    width: 76,
    height: 76,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
}));
