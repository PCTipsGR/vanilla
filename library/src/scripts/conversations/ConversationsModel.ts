/**
 * @copyright 2009-2019 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

import ReduxReducer from "@library/state/ReduxReducer";
import produce from "immer";
import { ILoadable, LoadStatus, IConversation } from "@library/@types/api";
import ConversationsActions from "@library/conversations/ConversationsActions";

interface IConversationsState {
    conversationsByID: ILoadable<{
        [key: number]: IConversation;
    }>;
}

export interface IConversationsStoreState {
    conversations: IConversationsState;
}

/**
 * Manage conversations state in Redux.
 */
export default class ConversationsModel implements ReduxReducer<IConversationsState> {
    public readonly initialState: IConversationsState = {
        conversationsByID: {
            data: {},
            status: LoadStatus.PENDING,
        },
    };

    /**
     * Update conversations state, based on the dispatched action.
     *
     * @param state Previous state of the store.
     * @param action Name for the type of action that was dispatched.
     */
    public reducer = (
        state: IConversationsState = this.initialState,
        action: typeof ConversationsActions.ACTION_TYPES,
    ): IConversationsState => {
        return produce(state, nextState => {
            switch (action.type) {
                case ConversationsActions.GET_CONVERSATIONS_REQUEST:
                    nextState.conversationsByID.status = LoadStatus.LOADING;
                    break;
                case ConversationsActions.GET_CONVERSATIONS_RESPONSE:
                    nextState.conversationsByID.status = LoadStatus.SUCCESS;
                    nextState.conversationsByID.data = {};
                    const conversations = action.payload.data as IConversation[];
                    conversations.forEach(conversation => {
                        nextState.conversationsByID.data![conversation.conversationID] = conversation;
                    });
                    break;
                case ConversationsActions.GET_CONVERSATIONS_ERROR:
                    nextState.conversationsByID.status = LoadStatus.ERROR;
                    nextState.conversationsByID.error = action.payload;
                    break;
            }
        });
    };
}
