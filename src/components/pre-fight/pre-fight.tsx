import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { HERO_LIST } from '../hero-selection/hero-list.const';
import './pre-fight.css';

interface IHeroInfo {
    id: number;
    name: string;
    logo: string;
}

// didn't find original icons for versus codes, so let's imitate it
const availableVersusCodeStates = [ 'blue', 'red', 'green' ];

enum VersusCodeKeys {
    Q = 'q',
    W = 'w',
    E = 'e',
    R = 'r',
    T = 't',
    Y = 'y'
}

export const PreFight = () => {
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();
    const [ firstPlayerHeroInfo, setFirstPlayerHeroInfo ] = useState<IHeroInfo>();
    const [ secondPlayerHeroInfo, setSecondPlayerHeroInfo ] = useState<IHeroInfo>();

    const [ versusCodeStates, setVersusCodeStates ] = useState({
        [VersusCodeKeys.Q]: '',
        [VersusCodeKeys.W]: '',
        [VersusCodeKeys.E]: '',
        [VersusCodeKeys.R]: '',
        [VersusCodeKeys.T]: '',
        [VersusCodeKeys.Y]: ''
    });

    useEffect(() => {
        // get heroes names from query params, if hero is not right or not set - redirect to hero selection page
        const firstPlayerHeroName = searchParams.get('p1');
        const secondPlayerHeroName = searchParams.get('p2');

        const firstPlayerHeroInfo = HERO_LIST.find((hero) => hero.name === firstPlayerHeroName) || null;
        const secondPlayerHeroInfo = HERO_LIST.find(hero => hero.name === secondPlayerHeroName) || null;

        if (!firstPlayerHeroInfo || !secondPlayerHeroInfo) {
            navigate('/hero-selection');
        } else {
            setFirstPlayerHeroInfo(firstPlayerHeroInfo);
            setSecondPlayerHeroInfo(secondPlayerHeroInfo);

            setTimeout(() => {
                navigate('/hero-selection');
            }, 4000)
        }
    }, [ navigate ]);

    const getNextVersusCodeState = (currentState: string): string => {
        const stateIndex = availableVersusCodeStates.indexOf(currentState);
        let nextState = '';

        if (stateIndex === -1) {
            nextState = availableVersusCodeStates[0];
        } else if (stateIndex !== (availableVersusCodeStates.length - 1)) {
            nextState = availableVersusCodeStates[stateIndex + 1];
        }

        return nextState;
    };

    const getCssClassForVersusCodeState = (versusCodeKey: string): string => {
        let versusCodeCssClass = 'bg-white';
        const versusCodeState = versusCodeStates[versusCodeKey as VersusCodeKeys];

        if (versusCodeState) {
            versusCodeCssClass = `bg-${versusCodeState}`;
        }

        return versusCodeCssClass;
    };

    const versusCodeKeyPressHandler = useCallback((e: KeyboardEvent) => {
        debugger
        switch (e.key) {
            case VersusCodeKeys.Q:
            case VersusCodeKeys.W:
            case VersusCodeKeys.E:
            case VersusCodeKeys.R:
            case VersusCodeKeys.T:
            case VersusCodeKeys.Y: {
                const currentState = versusCodeStates[e.key];
                const nextState = getNextVersusCodeState(currentState);

                setVersusCodeStates({
                    ...versusCodeStates,
                    [e.key]: nextState
                });

                break;
            }
        }
    }, [ versusCodeStates ]);

    useEffect(() => {
        document.addEventListener('keydown', versusCodeKeyPressHandler);

        return () => {
            document.removeEventListener('keydown', versusCodeKeyPressHandler);
        };
    }, [ versusCodeKeyPressHandler ]);

    return (
        <div className="pre-fight-screen">
            <div className="versus">
                <div className="p1-character">
                    <div className="hero-name">
                        {firstPlayerHeroInfo?.name}
                    </div>
                    <img className="hero-logo" alt={firstPlayerHeroInfo?.name} src={firstPlayerHeroInfo?.logo}/>
                </div>
                <div className="vs-text">
                    VS
                </div>
                <div className="p2-character">
                    <div className="hero-name">
                        {secondPlayerHeroInfo?.name}
                    </div>
                    <img className="hero-logo" alt={secondPlayerHeroInfo?.name} src={secondPlayerHeroInfo?.logo}/>
                </div>
            </div>

            <div className="versus-codes">
                {Object.entries(VersusCodeKeys).map(([ key, value ]) => (
                    <div key={key} className={`versus-code ${getCssClassForVersusCodeState(value)}`}>{key}</div>
                ))}
            </div>
        </div>
    );
};