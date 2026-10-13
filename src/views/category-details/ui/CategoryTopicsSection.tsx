import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { categoryDetailsText } from '@/views/category-details/constants/categoryDetailsText';
import { EmptyState } from '@/views/category-details/ui/EmptyState';

import { ThemeDeleteAdapter } from '@/features/theme-delete';

import type { CategoryLibrary } from '@/entities/category';

type Props = {
    categoryId: string;
    topics: CategoryLibrary['topics'];
    topicQuestions: CategoryLibrary['topicQuestions'];
    onCreate: () => void;
    onEdit: (topicId: string) => void;
    onDeleted: (topicId: string) => void;
};

export function CategoryTopicsSection({
    categoryId,
    topics,
    topicQuestions,
    onCreate,
    onEdit,
    onDeleted,
}: Props) {
    return (
        <Stack gap={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">{categoryDetailsText.topics.title}</Typography>
                <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={onCreate}>
                    {categoryDetailsText.topics.create}
                </Button>
            </Stack>
            {topics.length ? (
                <TopicsGrid>
                    {topics.map((topic) => {
                        const questionsCount = topicQuestions.filter(
                            (link) => link.topicId === topic.id,
                        ).length;

                        return (
                            <TopicCard key={topic.id} variant="outlined">
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Stack direction="row" gap={1.25} alignItems="center">
                                        <TopicDot sx={{ backgroundColor: topic.accentColor }} />
                                        <Typography fontWeight={600}>{topic.name}</Typography>
                                    </Stack>
                                    <Stack direction="row">
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(topic.id)}
                                            aria-label={categoryDetailsText.topics.edit}
                                        >
                                            <EditRoundedIcon fontSize="small" />
                                        </IconButton>
                                        <ThemeDeleteAdapter
                                            topic={topic}
                                            questionsCount={questionsCount}
                                            onDeleted={onDeleted}
                                        />
                                    </Stack>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {categoryDetailsText.topics.questionsCount(questionsCount)}
                                </Typography>
                                <Button
                                    component={Link}
                                    href={`/knowledge-base/category/${categoryId}/topic/${topic.id}`}
                                    variant="outlined"
                                    sx={{ alignSelf: 'flex-end' }}
                                >
                                    {categoryDetailsText.topics.open}
                                </Button>
                            </TopicCard>
                        );
                    })}
                </TopicsGrid>
            ) : (
                <EmptyState
                    title={categoryDetailsText.topics.emptyTitle}
                    description={categoryDetailsText.topics.emptyDescription}
                />
            )}
            <Divider />
        </Stack>
    );
}

const TopicsGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
}));

const TopicCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2.25),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.75),
    borderRadius: theme.spacing(2),
}));

const TopicDot = styled(Box)({
    width: 12,
    height: 12,
    borderRadius: '50%',
});
