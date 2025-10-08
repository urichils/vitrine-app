import { HeartCrack } from "lucide-react";
import "../styles/NotFound.css";

export default function NotFound() {
    return (
        <div className="not-found">
            <div className="icon">
            <HeartCrack size={64} />
            </div>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist!</p>
        </div>
    );
}