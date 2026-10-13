import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { QuestionDeleteAdapter } from '@/features/question-delete';
import { categoryDetailsText } from '@/views/category-details/constants/categoryDetailsText';
import { EmptyState } from '@/views/category-details/ui/EmptyState';

import type { CategoryQuestion } from '@/entities/category';

type Props = {
    categoryId: string;
    questions: CategoryQuestion[];
    onCreate: () => void;
    onEdit: (question: CategoryQuestion) => void;
    onDeleted: (questionId: string) => void;
};

export function CategoryQuestionsSection({
    categoryId,
    questions,
    onCreate,
    onEdit,
    onDeleted,
}: Props) {
    return (
        <Stack gap={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5">{categoryDetailsText.questions.title}</Typography>
                    <Typography color="text.secondary">
                        {categoryDetailsText.questions.description}
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={onCreate}>
                    {categoryDetailsText.questions.create}
                </Button>
            </Stack>
            {questions.length ? (
                <Stack gap={1}>
                    {questions.map((question) => (
                        <Paper key={question.id} variant="outlined" sx={{ p: 2 }}>
                            <Stack direction="row" justifyContent="space-between" gap={2}>
                                <Box>
                                    <Typography>{question.question}</Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {question.answer}
                                    </Typography>
                                </Box>
                                <Stack direction="row">
                                    <Button
                                        component={Link}
                                        href={`/knowledge-base/category/${categoryId}/focus/${question.id}`}
                                        variant="outlined"
                                        sx={{ minWidth: 94 }}
                                    >
                                        {categoryDetailsText.questions.open}
                                    </Button>
                                    <IconButton
                                        onClick={() => onEdit(question)}
                                        aria-label={categoryDetailsText.questions.edit}
                                    >
                                        <EditRoundedIcon />
                                    </IconButton>
                                    <QuestionDeleteAdapter
                                        question={question}
                                        onDeleted={onDeleted}
                                    />
                                </Stack>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                <EmptyState
                    title={categoryDetailsText.questions.emptyTitle}
                    description={categoryDetailsText.questions.emptyDescription}
                />
            )}
        </Stack>
    );
}
