import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { Lamp } from 'lucide-react';

export default function EditPortfolio() {
    const { user } = useAuth();
    const { portfolioId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [portfolio, setPortfolio] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (!user) return;

        const fetchPortfolio = async () => {
            try {
                const res = await fetch(`http://localhost:4322/portfolio/${portfolioId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    },
                });

                const data = await res.json();
                setPortfolio(data);
            } catch (err) {
                console.error('Error fetching portfolio:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [user, portfolioId]);

    const saveChanges = async () => {
        setSaving(true);
        setFeedback('');

        try {
            const res = await fetch(`http://localhost:4322/portfolio/${portfolioId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${user.token}`, "Content-Type": "application/json",
                },
                body: JSON.stringify(portfolio),
            });  
            
            const data = await res.json();

            if (res.ok) {
                setFeedback("Portfolio updated successfully!");
            } else {
                setFeedback(data.error || "Error updating portfolio.");
            }
        } catch (err) {
            console.error(err);
            setFeedback("Error updating portfolio.");
        } finally {
            setSaving(false);
        }
    };
    if (loading) return <p style={{marginTop: "6rem", textAlign: "center"}}>Loading...</p>;

    return (
        <>
            <div className="edit-container">
                <h1>Edit Portfolio</h1>
                <label>Name</label>
                <input value={portfolio?.name || ""} onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })} />
                
                <label>Description</label>
                <textarea value={portfolio?.slug || ""} onChange={(e) => setPortfolio({ ...portfolio, slug: e.target.value })} />
                
                <label>Theme</label>
                <input value={portfolio?.theme || ""} onChange={(e) => setPortfolio({ ...portfolio, theme: e.target.value })} />

                <button onClick={saveChanges} disabled={saving}>
                    {saving ? "Saving...": "Saving Changes"}
                </button>

                {feedback && <p className="feedback">{feedback}</p>}

                <button className="preview-btn" onClick={() => navigate(`/portfolio/${portfolio.slug}`)}>Preview</button>
            </div>
            <Footer />
        </>
    );
}