import React from "react";
import { Effect } from "../types/gameTypes";
import { Text } from "./text";
import { useData } from "../logic/useData";

export const EffectTooltip: React.FC<{
  effectKeys: number[];
  remaining?: number;
}> = ({ effectKeys, remaining = null }) => {
  const effectsData = useData().gameData.effects;

  if (effectKeys.length === 0) return null;

  return (
    <div>
      {effectKeys.map((key) => {
        const effectData = effectsData[key] as Effect;
        const sideEffectKey = effectData.sideEffect;

        return (
          <div key={key}>
            {/* Name */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Text text={effectData.name} type="bold" colour="white" />
            </div>

            {/* Danger special case */}
            {effectData.name === "Danger" && (
              <Text
                text="Attracts the strongest enemy in the area."
                type="normal"
                colour="white"
              />
            )}

            {/* Duration */}
            {effectData.duration && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text
                  text={`Duration: `}
                  type="normal"
                  colour="white"
                />
                <Text
                  text={
                    remaining != null
                      ? `${remaining}/${effectData.duration}`
                      : `${effectData.duration}`
                  }
                  type="bold"
                  colour="white"
                />
              </div>
            )}

            {/* Stat Bonuses */}
            {effectData.bonus &&
              Object.entries(effectData.bonus).map(([stat, bonus]) => (
                <div key={stat} style={{ display: "flex" }}>
                  <Text
                    text={`${stat}: `}
                    type="normal"
                    colour="white"
                  />
                  <Text
                    text={`${bonus.absolute != null
                      ? bonus.absolute > 0
                        ? `+${bonus.absolute}`
                        : `${bonus.absolute}`
                      : ""
                      }${bonus.percent != null
                        ? bonus.percent > 0
                          ? `+${bonus.percent}%`
                          : `${bonus.percent}%`
                        : ""
                      }`}
                    type="bold"
                    colour={
                      (bonus.absolute != null && bonus.absolute < 0) ||
                        (bonus.percent != null && bonus.percent < 0)
                        ? "red"
                        : "green2"
                    }
                  />
                </div>
              ))}

            {/* Heal-over-time */}
            {effectData.heal != null && effectData.every != null && (
              <>
                <div style={{ display: "flex" }}>
                  <Text
                    text={`Heal: `}
                    type="normal"
                    colour="white"
                  />
                  <Text
                    text={
                      effectData.heal > 0
                        ? `+${effectData.heal}`
                        : `${effectData.heal}`
                    }
                    type="bold"
                    colour={effectData.heal < 0 ? "red" : "green2"}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <Text
                    text={`Every: `}
                    type="normal"
                    colour="white"
                  />
                  <Text
                    text={`${effectData.every}`}
                    type="bold"
                    colour="white"
                  />
                </div>
              </>
            )}

            {/* Damage reduction */}
            {effectData.reduction != null && (
              <>
                <div style={{ display: "flex" }}>
                  <Text
                    text={`Damage: `}
                    type="normal"
                    colour="white"
                  />
                  <Text
                    text={`-${effectData.reduction}`}
                    type="bold"
                    colour={effectData.reduction < 0 ? "red" : "green2"}
                  />
                </div>
              </>
            )}

            {/* Recursive side-effect tooltip */}
            {sideEffectKey != null && (
              <>
                <Text text="Inflicts: " type="normal" colour="white" />
                <div style={{ marginLeft: 16 }}>
                  <EffectTooltip effectKeys={[sideEffectKey]} />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};