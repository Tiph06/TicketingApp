export type Ticket = {
    id: string;
    title: string;
    company?: string;
    priority?: "low"|"normal"|"high"|"urgent";
    createdAt?: string;
    status: "open"|"in_progress"|"closed";
};

export async function getTicketsByStatus(
    status: Ticket["status"],
    token: string | null
): Promise<Ticket[]> {
  // À brancher sur votre API : `${API_URL}/tickets?status=${status}`
  // headers: { Authorization: `Bearer ${token}` }
  await new Promise(r => setTimeout(r, 300)); // petit fake delay
    return [
        { id: `${status}-1`, title: `Ticket ${status} #1`, status },
        { id: `${status}-2`, title: `Ticket ${status} #2`, status },
    ];
}
