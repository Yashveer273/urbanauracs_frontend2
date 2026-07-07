import React from "react";

export default function GooglePlayButton({
  href,
  title = "Get it on Google Play",
  className = "",
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className={`google-play-btn ${className}`}
    >
      Google Play

      <style>{`
        .google-play-btn{
          position:relative;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:15px 18px 7px 44px;
          margin:5px 0;
          background:#111827;
          color:#fff;
          border:1px solid #000;
          border-radius:8px;
          text-decoration:none;
          font-size:18px;
          font-weight:600;
          line-height:1;
          transition:.25s ease;
          font-family:Inter,system-ui,sans-serif;
        }

        .google-play-btn:hover{
          background:#1f2937;
          color:#fff;
          text-decoration:none;
          transform:translateY(-1px);
          box-shadow:0 8px 20px rgba(0,0,0,.18);
        }

        .google-play-btn::before{
          content:"";
          position:absolute;
          left:10px;
          width:28px;
          height:28px;
          background:url("https://4.bp.blogspot.com/-52U3eP2JDM4/WSkIT1vbUxI/AAAAAAAArQA/iF1BeARv2To-2FGQU7V6UbNPivuv_lccACLcB/s30/nexus2cee_ic_launcher_play_store_new-1.png")
            center/cover no-repeat;
        }

        .google-play-btn::after{
          content:"GET IT ON";
          position:absolute;
          top:5px;
          left:44px;
          font-size:10px;
          font-weight:500;
          letter-spacing:.6px;
          opacity:.8;
        }
      `}</style>
    </a>
  );
}