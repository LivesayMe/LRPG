import { writable } from "svelte/store";

const inventoryValue = localStorage.getItem("inventory");
export const inventory = writable(inventoryValue ? JSON.parse(inventoryValue) : {items: []});

inventory.subscribe((value) => localStorage.setItem("inventory", JSON.stringify(value)));