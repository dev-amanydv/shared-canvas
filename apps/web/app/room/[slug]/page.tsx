import axios from "axios"
import ChatRoom from "../../../components/ChatRoom";

async function getRoomId (slug: string) {
    const backendUrl = process.env.BACKEND_URL;
    try {
        const response = await axios.get(`${backendUrl}/room/${slug}`);
        return ( response).data.data.roomId;
    } catch (error) {
        console.error("Error in getting roomId: ", error);
        return false
    }
}

export default async function Room ({
    params
}: {
    params: {
        slug: string
    }
}) {
    const slug = await params;
    const roomId = await getRoomId(slug.slug)

    return <ChatRoom roomId={roomId} />
}