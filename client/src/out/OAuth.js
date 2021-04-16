import useGitHub from "./GitHubAuthentication";

export default function OAuth() {
    return (
        <div className="auth-nav-body">
            <div className="form-out">
                <div className="oauth-logo">
                    <img src="/GitHub-Mark-64px.png" onClick={useGitHub} />
                </div>
            </div>
        </div>
    );
}
