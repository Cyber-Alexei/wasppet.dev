"use client";
import React, {
  ChangeEvent,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import {
  postEngineItems,
  postEngineItem,
  itemsSnippetProperty,
} from "@/interfaces/general_use_interfaces";
import { TagItemComponent } from "@/components/new_post/engine_components/headerTag";
import { orderItems } from "@/utils/algorithms/ordering";
import { useMainContext } from "@/hooks/main_context";
import { MonacoEditorInstancePostCreation } from "@/components/monaco_editor/monaco_post_creation";

// Context interface ---------------------------

interface postContextContents {
  counter: number;
  setCounter: Dispatch<SetStateAction<number>>;
  items: postEngineItems;
  setItems: Dispatch<SetStateAction<postEngineItems>>;
  orderedItems: postEngineItem[];
  onChangeHeaders: (e: ChangeEvent<HTMLInputElement>, itemKey: string) => void;
  onChangeP: (e: ChangeEvent<HTMLTextAreaElement>, itemKey: string) => void;
  onUpItem: (itemKey: string) => void;
  onDownItem: (itemKey: string) => void;
  tagItemSetter: (tag: string) => void;
  tagItemBuilder: (itemKey: string) => void;
  styles: { [key: string]: string };
  uniqueH1TitleBuilder: () => React.ReactNode;
  tagSnippetSetter: (tag: string, data: itemsSnippetProperty) => void;
  tagSnippetBuilder: (
    itemKey: string,
    data: itemsSnippetProperty,
  ) => React.ReactNode;
  postInUpdateId: number | null;
  setPostInUpdateId: Dispatch<SetStateAction<number | null>>;
  showComments: boolean;
  setShowComments: Dispatch<SetStateAction<boolean>>;
}

// Context creation ----------------------------

export const PostContext = createContext<postContextContents | undefined>(
  undefined,
);

// Provider ------------------------------------

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Context --------------------------------

  const { darkModeEnabled } = useMainContext();

  // State -----------------------------------

  const [postInUpdateId, setPostInUpdateId] = useState<number | null>(null);
  // ID of a post established to be updated (its items in "items")

  const [counter, setCounter] = useState<number>(2);
  /////// Counter to organize the position of items, uniqueness and order of creation

  const [items, setItems] = useState<postEngineItems>({
    "h1-1": { item: "h1-1", order: 1, value: "" },
  });

  /////// State to store post engine items data

  const [orderedItems, setOrderedItems] = useState<postEngineItem[]>([]);

  /////// State to store post engine items data but ordered

  const [showComments, setShowComments] = useState<boolean>(false);

  // Handle events ---------------------------

  const onChangeHeaders = (
    e: ChangeEvent<HTMLInputElement>,
    itemKey: string,
  ) => {
    const itemKeyOrderNumber = items[itemKey].order;
    setItems({
      ...items,
      [itemKey]: {
        item: itemKey,
        order: itemKeyOrderNumber,
        value: e.target.value,
      },
    });
  };

  const onChangeP = (e: ChangeEvent<HTMLTextAreaElement>, itemKey: string) => {
    const itemKeyOrderNumber = items[itemKey].order;
    setItems({
      ...items,
      [itemKey]: {
        item: itemKey,
        order: itemKeyOrderNumber,
        value: e.target.value,
      },
    });
  };

  // Action functions ------------------------

  const onUpItem = (itemKey: string) => {
    if (items[itemKey].order === 2) return;
    // Previous item (above)
    const prevItem = Object.values(items).find((item: postEngineItem) => {
      return item.order === items[itemKey].order - 1;
    });
    // Protect the execution
    if (prevItem === undefined) return;
    // Clicked item
    const clickedItem = items[itemKey];
    // Set the new state
    if (prevItem.snippet && clickedItem.snippet) {
      setItems({
        ...items,
        [prevItem.item]: {
          item: prevItem.item,
          order: prevItem.order + 1,
          snippet: prevItem.snippet,
        },
        [clickedItem.item]: {
          item: clickedItem.item,
          order: clickedItem.order - 1,
          snippet: clickedItem.snippet,
        },
      });
      return;
    }
    if (prevItem.snippet) {
      setItems({
        ...items,
        [prevItem.item]: {
          item: prevItem.item,
          order: prevItem.order + 1,
          snippet: prevItem.snippet,
        },
        [clickedItem.item]: {
          item: clickedItem.item,
          order: clickedItem.order - 1,
          value: clickedItem.value,
        },
      });
      return;
    }
    if (clickedItem.snippet) {
      setItems({
        ...items,
        [prevItem.item]: {
          item: prevItem.item,
          order: prevItem.order + 1,
          value: prevItem.value,
        },
        [clickedItem.item]: {
          item: clickedItem.item,
          order: clickedItem.order - 1,
          snippet: clickedItem.snippet,
        },
      });
      return;
    }
    setItems({
      ...items,
      [prevItem.item]: {
        item: prevItem.item,
        order: prevItem.order + 1,
        value: prevItem.value,
      },
      // Modify the order of the previous item (go down)
      [clickedItem.item]: {
        item: clickedItem.item,
        order: clickedItem.order - 1,
        value: clickedItem.value,
      },
      // Modify the order of the clicked item (go up)
    });
  };

  const onDownItem = (itemKey: string) => {
    // Number of items, so greater item order number (lowest)
    const greaterItemOrderNumber = Object.keys(items).length;
    if (items[itemKey].order === greaterItemOrderNumber) return;
    // Next item
    const nextItem = Object.values(items).find((item: postEngineItem) => {
      return item.order === items[itemKey].order + 1;
    });
    // Protect the execution
    if (nextItem === undefined) return;
    // Modify the order of the next item (go up)
    // Clicked item
    const clickedItem = items[itemKey];
    // Modify the order of the clicked item (go down)
    // Set the new state
    if (nextItem.snippet && clickedItem.snippet) {
      setItems({
        ...items,
        [nextItem.item]: {
          item: nextItem.item,
          order: nextItem.order - 1,
          snippet: nextItem.snippet,
        },
        [clickedItem.item]: {
          item: clickedItem.item,
          order: clickedItem.order + 1,
          snippet: clickedItem.snippet,
        },
      });
      return;
    }
    if (nextItem.snippet) {
      setItems({
        ...items,
        [nextItem.item]: {
          item: nextItem.item,
          order: nextItem.order - 1,
          snippet: nextItem.snippet,
        },
        [clickedItem.item]: {
          item: clickedItem.item,
          order: clickedItem.order + 1,
          value: clickedItem.value,
        },
      });
      return;
    }
    if (clickedItem.snippet) {
      setItems({
        ...items,
        [nextItem.item]: {
          item: nextItem.item,
          order: nextItem.order - 1,
          value: nextItem.value,
        },
        [clickedItem.item]: {
          item: clickedItem.item,
          order: clickedItem.order + 1,
          snippet: clickedItem.snippet,
        },
      });
      return;
    }
    setItems({
      ...items,
      [nextItem.item]: {
        item: nextItem.item,
        order: nextItem.order - 1,
        value: nextItem.value,
      },
      [clickedItem.item]: {
        item: clickedItem.item,
        order: clickedItem.order + 1,
        value: clickedItem.value,
      },
    });
  };

  const onDeleteItem = (itemKey: string) => {
    const { [itemKey]: _, ...newItems } = items;
    setItems(newItems);
  };

  // Components state setters ---------------

  const tagItemSetter = (tag: string) => {
    const itemKey = `${tag}-${counter}`; // e.g: h3-0
    setItems({
      ...items,
      [itemKey]: { item: itemKey, order: counter, value: "" },
    });

    setCounter((prevState) => prevState + 1);
  };

  const tagSnippetSetter = (tag: string, data: itemsSnippetProperty) => {
    const itemKey = `${tag}-${counter}`;
    setItems({
      ...items,
      [itemKey]: { item: itemKey, order: counter, snippet: data },
    });

    setCounter((prevState) => prevState + 1);
  };

  // Components builders ----------------------

  const uniqueH1TitleBuilder = (): React.ReactNode => {
    const h1 = orderedItems.find((item) => item.item === "h1-1");
    return (
      <input
        name="h1-1"
        className={`order-${h1?.order} ${styles.input} ${styles["h1"]}`}
        value={items[h1!.item].value}
        onChange={(e) => onChangeHeaders(e, "h1-1")}
        placeholder="Title / H1"
      />
    );
  };

  const tagItemBuilder = (itemKey: string): React.ReactNode => {
    return (
      <TagItemComponent
        items={items}
        itemKey={itemKey}
        onChangeHeaders={(e) => onChangeHeaders(e, itemKey)}
        onChangeP={(e) => onChangeP(e, itemKey)}
        onUpItem={() => onUpItem(itemKey)}
        onDownItem={() => onDownItem(itemKey)}
        onDeleteItem={() => onDeleteItem(itemKey)}
        orderedItems={orderedItems}
      />
    );
  };

  const tagSnippetBuilder = (
    itemKey: string,
    data: itemsSnippetProperty,
  ): React.ReactNode => {
    return (
      <MonacoEditorInstancePostCreation
        snippetId={data.snippetId}
        onUpItem={() => onUpItem(itemKey)}
        onDownItem={() => onDownItem(itemKey)}
        onDeleteItem={() => onDeleteItem(itemKey)}
      />
    );
  };

  // useEffect --------------------------

  // Reorder items due to change in quantity or order
  useEffect(() => {
    setOrderedItems(orderItems(items));
  }, [items]);

  // Styles -----------------------------

  const styles = {
    itemButtons: `px-[2px] flex items-center w-auto ${darkModeEnabled ? "text-primary-font-color" : "text-primary-color"}`,
    input: `w-[100%] focus:outline-none px-2 py-1 ${
      darkModeEnabled
        ? "bg-fourth-background text-primary-font-color"
        : "bg-gray-100"
    }`,
    h1: "text-[25px] font-[700]",
    h2: "text-[22px] font-[600]",
    h3: "text-[20px] font-[600]",
    h4: "text-[18px] font-[500]",
    h5: "text-[16px] font-[500]",
    h6: "text-[14px] font-[500]",
  };

  // All data --------------------------------

  const data = {
    counter,
    setCounter,
    items,
    setItems,
    orderedItems,
    onChangeHeaders,
    onChangeP,
    onUpItem,
    onDownItem,
    tagItemSetter,
    tagItemBuilder,
    styles,
    uniqueH1TitleBuilder,
    tagSnippetSetter,
    tagSnippetBuilder,
    postInUpdateId,
    setPostInUpdateId,
    showComments,
    setShowComments,
  };

  // JSX -------------------------------------

  return <PostContext.Provider value={data}>{children}</PostContext.Provider>;
};
