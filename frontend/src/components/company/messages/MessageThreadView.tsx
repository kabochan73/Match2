"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  companyLikeMessagesQueryKey,
  companyLikeQueryKey,
  fetchCompanyLike,
  fetchCompanyLikeMessages,
  sendCompanyLikeMessage,
} from "@/lib/company/likes/api";
import { getErrorMessage } from "@/lib/api/validation";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ja-JP");
}

export function MessageThreadView() {
  const { id } = useParams<{ id: string }>();
  const likeId = Number(id);
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const [messageError, setMessageError] = useState<string | null>(null);

  const { data: like } = useQuery({
    queryKey: companyLikeQueryKey(likeId),
    queryFn: () => fetchCompanyLike(likeId),
  });

  const isMatched = like?.status === "matched";

  const { data: messages } = useQuery({
    queryKey: companyLikeMessagesQueryKey(likeId),
    queryFn: () => fetchCompanyLikeMessages(likeId),
    enabled: isMatched,
  });

  const sendMutation = useMutation({
    mutationFn: () => sendCompanyLikeMessage(likeId, body),
    onSuccess: (message) => {
      queryClient.setQueryData(companyLikeMessagesQueryKey(likeId), (prev: typeof messages) => [
        ...(prev ?? []),
        message,
      ]);
      setBody("");
    },
    onError: (error) => {
      setMessageError(getErrorMessage(error));
    },
  });

  if (!like) return null;

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <Link href="/companies/messages" className="text-sm text-gray-600">
          メッセージ一覧に戻る
        </Link>
      </div>

      <section className="flex w-full max-w-2xl flex-col gap-2">
        <Link href={`/companies/likes/${likeId}`} className="w-fit">
          <h1 className="text-lg font-medium text-blue-600 underline">{like.user.name}</h1>
        </Link>
      </section>

      {isMatched ? (
        <section className="flex w-full max-w-2xl flex-col gap-4">
          <div className="flex flex-col gap-3">
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col gap-1 ${
                    message.sender_type === "company" ? "items-end" : "items-start"
                  }`}
                >
                  <p
                    className={`max-w-[80%] whitespace-pre-wrap rounded px-3 py-2 text-sm ${
                      message.sender_type === "company"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.body}
                  </p>
                  <span className="text-xs text-gray-400">
                    {formatDateTime(message.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">まだメッセージはありません</p>
            )}
          </div>

          {messageError && <p className="text-sm text-red-600">{messageError}</p>}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (body.trim() === "") return;
              setMessageError(null);
              sendMutation.mutate();
            }}
            className="flex gap-2"
          >
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={2}
              className="flex-1 rounded border p-2 text-sm"
              placeholder="メッセージを入力"
            />
            <button
              type="submit"
              disabled={sendMutation.isPending || body.trim() === ""}
              className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              送信
            </button>
          </form>
        </section>
      ) : (
        <p className="text-sm text-gray-500">マッチが成立するとメッセージを送信できます</p>
      )}
    </main>
  );
}
