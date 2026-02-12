export function getConversationId() {
  let id = localStorage.getItem("conversationId");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("conversationId", id);
  }

  return id;
}