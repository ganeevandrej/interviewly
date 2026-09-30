export type { Training, TrainingInput, TrainingOrder, TrainingQuestionStatus, TrainingStatus } from './model/types';
export {
    useCreateTrainingMutation,
    useDeleteTrainingMutation,
    useRegenerateTrainingMutation,
    useRestartTrainingMutation,
    useStartTrainingMutation,
    useUpdateTrainingMutation,
} from './api/trainingApi';
