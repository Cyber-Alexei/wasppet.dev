"use client";

export const Logo = ({styles}:{styles:string}): JSX.Element => {

  return (
    <div id="logo" className="inline">
      <h1
        className={styles}
      >
        <span className="text-primary-color">W</span>
        asppet.dev
      </h1>
    </div>
  );
};