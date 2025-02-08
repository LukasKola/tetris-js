import { FC } from "react";

const LandingPage: FC<{onCLick: () => void}> = ( { onCLick}) => {
    return (
        <div style={{ height: '100%'}} onKeyDown={(e) => console.log('event')}>
            <div style={{ margin: 'auto'}}>
                <h1 style={{marginBottom: '20px'}}>
                    Welcome to Tetris js
                </h1>
                <div>
                    <button onClick={onCLick} >Play</button>
                </div>
            </div>
        </div>
    )
};

export default LandingPage;