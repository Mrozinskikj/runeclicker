import React, { useState, useRef, useCallback, useEffect } from "react";
import { useScale } from "../../logic/useScale";
import { Window } from "../window";
import { Item } from "../item";
import { usePlayer } from "../../logic/usePlayer";
import { useItems } from "../../logic/useItems";
import { useData } from "../../logic/useData";
import { FixedItem } from "../../types/gameTypes";
import { ItemSlot } from "./itemSlot";
import { EquipmentSlot } from "./equipmentSlot";

// ---------------------
// Main Inventory Component
// ---------------------
export const Inventory: React.FC = () => {
    const sourceIndex = useItems((state) => state.sourceIndex);
    const isDragging = useItems((state) => state.isDragging);
    const updatedItems = useItems((state) => state.updatedItems);
    const highlightedIndex = useItems((state) => state.highlightedIndex);
    const highlightedSlot = useItems((state) => state.getHighlightedSlot)(highlightedIndex);

    const playerItems = usePlayer((state) => state.player.inventory.items);
    const playerEquipment = usePlayer((state) => state.player.inventory.equipment);
    const gameItems = useData((state) => state.gameData.items);

    const { scale, offsetX } = useScale();
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

    const equipmentSlots = [
        { x: 0, y: 1, key: "hand" },
        { x: 1, y: 0, key: "head" },
        { x: 1, y: 1, key: "torso" },
        { x: 1, y: 2, key: "legs" },
        { x: 2, y: 0, key: "neck" },
        { x: 0, y: 0, key: "back" },
        { x: 2, y: 1, key: "finger" },
    ];

    // Add mousemove listener to update drag position while dragging.
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setDragPosition({ x: e.clientX, y: e.clientY });
        };

        if (sourceIndex !== null) {
            window.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [sourceIndex]);

    // Highlight the section of the inventory corresponding to the selected backpack
    const InventoryHighlight: React.FC = () => {
        if (highlightedIndex == "back" && playerEquipment.back) {
            const space = gameItems[playerEquipment.back.id].space!;
            const slotSize = 44;
            return (
                <div
                    style={{
                        position: "absolute",
                        top: `${Math.max(0, Math.ceil(playerItems.length / 5) - (space / 5)) * slotSize}px`,
                        left: 0,
                        width: `${5 * slotSize}px`,
                        height: `${(space / 5) * slotSize}px`,
                        border: "1px solid white",
                        pointerEvents: "none",
                        boxSizing: "border-box",
                    }}
                />
            );
        }
    }

    const grabItem = useCallback((index: number | string, event: React.MouseEvent) => {
        const initialX = event.clientX;
        const initialY = event.clientY;
        setDragPosition({ x: initialX, y: initialY });

        // Listen for mouse movements- dragging if mouse moved enough from original position
        const handleMouseMove = (e: MouseEvent) => {
            if (e.buttons === 0) {
                window.removeEventListener("mousemove", handleMouseMove);
                return;
            }
            const distanceDragged = Math.sqrt(
                ((initialX - e.clientX) / scale) ** 2 +
                ((initialY - e.clientY) / scale) ** 2
            );
            if (distanceDragged > 8) {
                useItems.setState({ isDragging: true });
                window.removeEventListener("mousemove", handleMouseMove);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);

        useItems.setState({ sourceIndex: index });
    }, [scale, offsetX]);

    // Determine the currently grabbed item.
    let grabbedItem: FixedItem | null = null;
    if (sourceIndex !== null) {
        if (typeof sourceIndex === "number") {
            grabbedItem = playerItems[sourceIndex];
        } else {
            grabbedItem = playerEquipment[sourceIndex];
        }
    }

    const itemMouseEnter = useCallback((index: number | string) => {
        if (!isDragging) {
            useItems.setState({ highlightedIndex: index });
        }
    }, [isDragging]);
    const itemMouseLeave = useCallback(() => {
        if (!isDragging) {
            useItems.setState({ highlightedIndex: null });
        }
    }, [isDragging]);
    const itemMouseEnterRef = useRef(itemMouseEnter);
    const itemMouseLeaveRef = useRef(itemMouseLeave);
    useEffect(() => {
        itemMouseEnterRef.current = itemMouseEnter;
    }, [itemMouseEnter]);
    useEffect(() => {
        itemMouseLeaveRef.current = itemMouseLeave;
    }, [itemMouseLeave]);
    const stableItemMouseEnter = useCallback((...args: Parameters<typeof itemMouseEnter>) => {
        itemMouseEnterRef.current(...args);
    }, []);
    const stableItemMouseLeave = useCallback((...args: Parameters<typeof itemMouseLeave>) => {
        itemMouseLeaveRef.current(...args);
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                marginRight: 5,
                cursor: grabbedItem !== null ? "grab"
                    : (typeof (highlightedIndex) == "number" && playerItems[highlightedIndex] !== null)
                        || (typeof (highlightedIndex) == "string" && playerEquipment[highlightedIndex] !== null)
                        ? "pointer" : "default",
            }}
        >
            {/* Inventory Items window */}
            <Window
                content={
                    <div style={{ position: "relative", maxHeight: "264px", overflowY: "scroll", overflowX: "clip" }}>
                        {/* highlight rectangle for backpack select */}
                        <InventoryHighlight />

                        {/* items grid */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5, 44px)",
                            }}
                        >
                            {playerItems.map((item, index) => (
                                <ItemSlot
                                    key={index}
                                    item={item}
                                    index={index}
                                    isSelected={sourceIndex === index && isDragging}
                                    isUpdated={item ? updatedItems.includes(item.id) : false}
                                    grabItem={grabItem}
                                    itemMouseEnter={stableItemMouseEnter}
                                    itemMouseLeave={stableItemMouseLeave}
                                />
                            ))}
                        </div>
                    </div>
                }
                mb={5}
            />

            {/* Equipment window */}
            <Window
                content={
                    <div style={{ position: "relative", height: "144px" }}>
                        {equipmentSlots.map(slotData => (
                            <EquipmentSlot
                                key={slotData.key}
                                x={(slotData.x) * 47 + 41}
                                y={(slotData.y) * 47 + 3}
                                item={playerEquipment[slotData.key]}
                                slot={slotData.key}
                                isSelected={sourceIndex === slotData.key && isDragging}
                                highlighted={highlightedSlot == slotData.key}
                                grabItem={grabItem}
                                itemMouseEnter={stableItemMouseEnter}
                                itemMouseLeave={stableItemMouseLeave}
                            />
                        ))}
                    </div>
                }
                mt={5}
            />

            {/* Floating item icon following the mouse */}
            {sourceIndex !== null && grabbedItem && isDragging && (
                <div
                    style={{
                        position: "fixed",
                        top: Math.round(dragPosition.y) / scale,
                        left: (Math.round(dragPosition.x) - offsetX) / scale,
                        pointerEvents: "none",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1000,
                        filter: "drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.5))", // Adds shadow in the shape of the image
                    }}
                >
                    <Item index={grabbedItem.id} quantity={1} updated={false} />
                </div>
            )}
        </div>
    );
};