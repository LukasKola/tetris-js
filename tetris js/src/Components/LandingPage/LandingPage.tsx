import { FC } from "react";

const LandingPage: FC<{onCLick: () => void}> = ( { onCLick}) => {
    return (
        <div>
            Welcome to Tetris js
            <div>
                <button onClick={onCLick} >Play</button>
            </div>
        </div>
    )
};

export default LandingPage;