import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
    const [loading, setLoading] = useState(true)
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        console.log({WS_URL})
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF5LndvcmswOUBnbWFpbC5jb20iLCJpZCI6IjUwMDkwYmFjLTkwNzQtNDNkZS1iYzczLWY2MGI4YTEzYjhiMyIsImlhdCI6MTc2OTcxODMyNiwiZXhwIjoxNzcwOTI3OTI2LCJhdWQiOiJVc2VycyIsImlzcyI6IlNoYXJlZENhbnZhcyJ9.PyPY1ZJpQNS-BCePimR58l8NgEGuFTJuiWzIOWfWZZ0` as string);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws)
        }
    }, []);

    return {
        socket, loading
    }
}