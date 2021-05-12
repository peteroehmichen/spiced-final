import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateLocationSection } from "../helpers/actions";
import { Loader } from "../helpers/helperComponents";
import SectionVote from "./SectionVote";

export default function LocationTips() {
    const dispatch = useDispatch();
    const [newSection, setNewSection] = useState();
    const [values, setValues] = useState(null);
    const [editing, setEditing] = useState(false);

    const [secEdit, setSecEdit] = useState({});
    const { location } = useSelector((store) => store);

    const fillNew = function (e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const { infos } = location;

    return (
        <div className="location-tips">
            {!location.name && <Loader />}
            {location.name && infos?.length === 0 && (
                <p>be the first to add infos here</p>
            )}
            {infos &&
                infos.map((elem, i) => (
                    <div key={i}>
                        {!secEdit[i] && (
                            <div className="infos">
                                <h3>{elem.title}</h3>
                                <div className="infos-content">
                                    <p>{elem.content}</p>
                                </div>
                                <SectionVote id={elem.id} />
                                <div>
                                    <button
                                        disabled={editing}
                                        onClick={() => {
                                            setValues({
                                                title: elem.title,
                                                content: elem.content,
                                            });
                                            setEditing(true);
                                            setSecEdit({
                                                ...secEdit,
                                                [i]: true,
                                            });
                                        }}
                                    >
                                        edit
                                    </button>
                                </div>
                            </div>
                        )}
                        {secEdit[i] && (
                            <div key={i} className="infos">
                                <div className="infos-content">
                                    <input
                                        type="text"
                                        name="title"
                                        defaultValue={elem.title}
                                        onChange={fillNew}
                                    />
                                    <textarea
                                        defaultValue={elem.content}
                                        name="content"
                                        onChange={fillNew}
                                    />
                                </div>
                                <div>
                                    <button
                                        onClick={() => {
                                            setValues(null);
                                            setEditing(false);
                                            setSecEdit({
                                                ...secEdit,
                                                [i]: false,
                                            });
                                        }}
                                    >
                                        cancel
                                    </button>
                                    <button
                                        disabled={
                                            values.title === elem.title &&
                                            values.content === elem.content
                                        }
                                        onClick={() => {
                                            setEditing(false);
                                            setSecEdit({
                                                ...secEdit,
                                                [i]: false,
                                            });
                                            dispatch(
                                                updateLocationSection(
                                                    values,
                                                    location.id,
                                                    elem.id
                                                )
                                            );
                                        }}
                                    >
                                        submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            {!newSection && (
                <div
                    className="infos add"
                    onClick={() => {
                        setEditing(true);
                        setNewSection(true);
                        setValues(null);
                    }}
                >
                    ✚
                </div>
            )}
            {newSection && (
                <div className="infos">
                    <input
                        type="text"
                        placeholder="title of section"
                        name="title"
                        onChange={fillNew}
                    />
                    <div className="infos-content">
                        <textarea
                            placeholder="content"
                            name="content"
                            onChange={fillNew}
                        />
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                setValues(null);
                                setEditing(false);
                                setNewSection(false);
                            }}
                        >
                            cancel
                        </button>
                        <button
                            disabled={
                                !values || !values.title || !values.content
                            }
                            onClick={() => {
                                if (
                                    !infos.some(
                                        (section) =>
                                            section.title.toLowerCase() ===
                                            values.title.toLowerCase().trim()
                                    )
                                ) {
                                    setEditing(false);
                                    setNewSection(false);
                                    dispatch(
                                        updateLocationSection(
                                            values,
                                            location.id
                                        )
                                    );
                                } else {
                                    toast.error("Title already exists...");
                                }
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
