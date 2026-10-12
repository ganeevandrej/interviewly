export type { Topic, TopicDeletionImpact } from './model/types';
export {
    useCreateTopicMutation,
    useUpdateTopicMutation,
    useLazyGetTopicDeletionImpactQuery,
    useDeleteTopicMutation,
} from './api/topicApi';
