import clsx from "clsx";

export const GoogleIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    <title>Google icon</title>
    <path
      fill="#EA4335 "
      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
    />
    <path
      fill="#34A853"
      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
    />
    <path
      fill="#4A90E2"
      d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
    />
    <path
      fill="#FBBC05"
      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
    />
  </svg>
);

export const DiscordIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -28.5 256 256"
    version="1.1"
    preserveAspectRatio="xMidYMid"
    className={className}
  >
    <g>
      <path
        d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
        fill="#5865F2"
        fillRule="nonzero"
      ></path>
    </g>
  </svg>
);

export const DiscountIcon = ({ className }: { className: string }) => (
  <svg
    viewBox="0 0 20 20"
    className={clsx("fill-current", className)}
    focusable="false"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M6 3.072a2 2 0 0 0-.99 1.939 2 2 0 0 0-1.826 3.163 2 2 0 0 0 0 3.652 2 2 0 0 0 1.826 3.164 2 2 0 0 0 3.164 1.828 2 2 0 0 0 3.652 0 2 2 0 0 0 3.164-1.827 2 2 0 0 0 1.826-3.164 2 2 0 0 0 0-3.652 2 2 0 0 0-1.826-3.165 2 2 0 0 0-3.163-1.826 2 2 0 0 0-3.654 0 2 2 0 0 0-2.173-.112Zm6.832 4.483a1 1 0 1 0-1.664-1.11l-4 6a1 1 0 0 0 1.664 1.11l4-6Zm-5.832 1.445a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
    ></path>
  </svg>
);

export const Auth0Icon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 23.991 26.66"
    className={clsx("fill-current", className)}
    focusable="false"
    aria-hidden="true"
  >
    <g id="Group_4" data-name="Group 4" transform="translate(-22.54 -27.876)">
      <path
        id="Path_1"
        data-name="Path 1"
        d="M43.2,27.876H34.528l2.678,8.341h8.668l-7.012,4.97,2.677,8.4a11.454,11.454,0,0,0,4.334-13.369Zm-20,8.341H31.85l2.677-8.341H25.879L23.2,36.217a11.446,11.446,0,0,0,4.315,13.369l2.677-8.4Zm4.315,13.369,7.012,4.951,7.012-4.951-7.012-5.047Z"
      />
    </g>
  </svg>
);
