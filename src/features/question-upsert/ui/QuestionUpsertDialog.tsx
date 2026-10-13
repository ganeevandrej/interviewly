import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import {
    useCreateQuestionMutation,
    useUpdateQuestionMutation,
} from '@/entities/question';

import type { Question, QuestionDraft } from '@/entities/question';
import type { Topic } from '@/entities/topic';

type Props = {
    categoryId: string;
    open: boolean;
    draft?: QuestionDraft;
    topics: Topic[];
    onClose: () => void;
    onSaved: (question: Question) => void;
    onChange: (draft: QuestionDraft) => void;
};

export function QuestionUpsertDialog({
    categoryId,
    open,
    draft,
    topics,
    onClose,
    onSaved,
    onChange,
}: Props) {
    const [createQuestion] = useCreateQuestionMutation();
    const [updateQuestion] = useUpdateQuestionMutation();

    if (!draft) return null;

    const currentDraft = draft;

    async function save() {
        if (!currentDraft.question.trim() || !currentDraft.answer.trim()) return;

        const question = currentDraft.id
            ? await updateQuestion({
                  categoryId,
                  questionId: currentDraft.id,
                  input: {
                      question: currentDraft.question,
                      answer: currentDraft.answer,
                      topicId: currentDraft.topicId,
                  },
              }).unwrap()
            : await createQuestion({ categoryId, input: currentDraft }).unwrap();

        onSaved(question);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{draft.id ? 'Редактировать вопрос' : 'Новый вопрос'}</DialogTitle>
            <DialogContent>
                <Stack gap={2} sx={{ pt: 1 }}>
                    <TextField
                        label="Вопрос"
                        value={draft.question}
                        onChange={(event) => onChange({ ...draft, question: event.target.value })}
                        multiline
                        minRows={2}
                    />
                    <TextField
                        label="Ответ"
                        value={draft.answer}
                        onChange={(event) => onChange({ ...draft, answer: event.target.value })}
                        multiline
                        minRows={4}
                    />
                    <TextField
                        select
                        label="Тема"
                        value={draft.topicId ?? ''}
                        onChange={(event) =>
                            onChange({ ...draft, topicId: event.target.value || null })
                        }
                    >
                        <MenuItem value="">Без темы</MenuItem>
                        {topics.map((topic) => (
                            <MenuItem key={topic.id} value={topic.id}>
                                {topic.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button
                    variant="contained"
                    onClick={save}
                    disabled={!draft.question.trim() || !draft.answer.trim()}
                >
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
