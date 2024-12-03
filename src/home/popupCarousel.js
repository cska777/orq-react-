import React, { useState } from "react";
import PopUpWatchlist from "./popupWatchlist";

export function OeuvreDescription({ selectedOeuvre, titre, synopsis, realisateur, acteurs, date_sortie, onClose }) {

    return (
        <div>
            <div className="modalDesc">
                <div className="modalContentDesc">
                    <span className="closeBtnDesc" onClick={onClose}>&times;</span>
                    <h1 className="text-center">{titre}</h1>
                    <h2>Synopsis : </h2>
                    <p>{synopsis}</p>
                    <p><span className="fw-bold">Acteurs :</span>{acteurs.join(", ")}</p>
                    <p><span className="fw-bold">Realisateur :</span>{realisateur}</p>
                    <p><span className="fw-bold">Date de sortie : </span>{date_sortie}</p>

                    <div className="divWatchlist">
                        <PopUpWatchlist
                            selectedOeuvre={selectedOeuvre}
                        />
                    </div>

                </div>

            </div>
        </div>
    )
}