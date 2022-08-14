import type { ReactNode } from 'react';

type IProjectProps = {
  img: {
    src: string;
    alt: string;
  };
  name: string;
  description: string;
  link: string;
  category: ReactNode;
};

const Project = (props: IProjectProps) => (
  <div className="flex flex-row items-center gap-x-8 overflow-hidden rounded-md bg-slate-800 p-3">
    <div className="grow">
      <div className="items-center gap-y-2 sm:flex sm:flex-row">
        <div className="text-lg font-semibold sm:text-2xl">
          <a className="hover:text-cyan-400" href={props.link}>
            {props.name}
          </a>
        </div>
        <div className="ml-3 hidden gap-2 md:flex">{props.category}</div>
      </div>
      <div className="mt-2 flex gap-2 md:hidden">{props.category}</div>

      <p className="mt-3 text-sm text-gray-400 sm:text-base">
        {' '}
        <a href={props.link}>{props.description}</a>
      </p>
    </div>
    <div className="shrink-0 md:h-36">
      {props.img.src && (
        <a href={props.link}>
          <img
            className="h-20 w-20 object-cover object-center sm:h-36 sm:w-36"
            src={props.img.src}
            alt={props.img.src ? props.img.alt : '平木場のSNSアイコン'}
            loading="lazy"
          />
        </a>
      )}
    </div>
  </div>
);

export { Project };
