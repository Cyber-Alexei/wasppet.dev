import { ChangeEventHandler } from "react";
import {
  postEngineItem,
  postEngineItems,
} from "@/interfaces/general_use_interfaces";
import { usePostContext } from "@/hooks/post_context";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const TagItemComponent = ({
  items,
  itemKey,
  onChangeHeaders,
  onChangeP,
  onUpItem,
  onDownItem,
  orderedItems,
  onDeleteItem,
}: {
  items: postEngineItems;
  itemKey: string;
  onChangeHeaders: ChangeEventHandler<HTMLInputElement>;
  onChangeP: ChangeEventHandler<HTMLTextAreaElement>;
  onUpItem: () => void;
  onDownItem: () => void;
  orderedItems: postEngineItem[];
  onDeleteItem: () => void;
}): React.ReactNode => {
  // Context -------------------------

  const { styles } = usePostContext();

  // Functions -----------------------

  // Get the current item data / obj
  const currentItem = orderedItems.find((item) => item.item === itemKey);

  // Extract the tag to apply styles based on it
  const extractItemTag = () => {
    const endOfTagName = itemKey.indexOf("-");
    const tag = itemKey.substring(0, endOfTagName);
    return tag;
  };
  const tag = extractItemTag();

  // Posible values of headers

  const headers = ["h2", "h3", "h4", "h5", "h6"];

  // JSX -----------------------------

  return (
    <div className="flex">
      <div className="flex flex-col">
        <div onClick={onUpItem} className={styles.itemButtons}>
          <ArrowDropUpIcon />
        </div>
        <div onClick={onDownItem} className={styles.itemButtons}>
          <ArrowDropDownIcon />
        </div>
      </div>
      {headers.includes(tag) && (
        <input
          type="text"
          name={itemKey}
          className={`order-${currentItem?.order} ${styles.input} ${styles[tag]}`}
          value={items[currentItem!.item].value}
          onChange={onChangeHeaders}
          placeholder={`header ${tag}`}
        />
      )}
      {tag === "p" && (
        <textarea
          name={itemKey}
          className={`order-${currentItem?.order} ${styles.input} ${styles[tag]}`}
          value={items[currentItem!.item].value}
          //value={currentItem?.value}
          onChange={onChangeP}
          placeholder="Write your text"
        ></textarea>
      )}
      <div onClick={onDeleteItem} className={styles.itemButtons}>
        <DeleteOutlineIcon />
      </div>
    </div>
  );
};
