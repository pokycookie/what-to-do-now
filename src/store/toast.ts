import { TMessage } from "@/types";
import { makeRandomID } from "@/utils";
import { create } from "zustand";

interface IMessage {
  id: string;
  text: string;
  type: TMessage;
}

interface IToastState {
  messages: IMessage[];
  addMessage: (message: string, type?: TMessage) => void;
}

export const useToastStore = create<IToastState>((set) => ({
  messages: [],
  addMessage: (message, type) => {
    set((state) => ({
      messages: [
        ...state.messages,
        { id: makeRandomID(32), text: message, type: type ?? "success" },
      ],
    }));
    setTimeout(() => {
      set((state) => ({ messages: state.messages.filter((_, i) => i !== 0) }));
    }, 3000);
  },
}));
