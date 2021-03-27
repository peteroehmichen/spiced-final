import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLocationSection } from "../helpers/actions";
import { Loader } from "../helpers/helperComponents";

export default function LocationTips() {
    const dispatch = useDispatch();
    const [newSection, setNewSection] = useState();
    const [values, setValues] = useState();
    const [editing, setEditing] = useState(false);

    const [secEdit, setSecEdit] = useState({});
    const { location: loc } = useSelector((store) => store);

    const fillNew = function (e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    let infos;
    if (loc.infos) {
        infos = [];
        let parsedInfos = JSON.parse(loc.infos);
        let arrOfKeys = Object.keys(parsedInfos);
        infos = arrOfKeys.map((elem) => {
            return { title: elem, content: parsedInfos[elem] };
        });
    }

    return (
        <Fragment>
            {!loc.name && <Loader />}
            {loc.name && !infos && <p>be the first to add infos here</p>}
            {infos &&
                infos.map((elem, i) => (
                    <div key={i}>
                        {!secEdit[i] && (
                            <div className="infos">
                                <h3>{elem.title}</h3>
                                <div className="infos-content">
                                    <p>{elem.content}</p>
                                </div>
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
                                            !values ||
                                            !values.title ||
                                            !values.content
                                        }
                                        onClick={() => {
                                            setEditing(false);
                                            setSecEdit({
                                                ...secEdit,
                                                [i]: false,
                                            });
                                            dispatch(
                                                addLocationSection(
                                                    values,
                                                    loc.id,
                                                    {
                                                        title: elem.title,
                                                    }
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
                                setEditing(false);
                                setNewSection(false);
                                dispatch(
                                    addLocationSection(values, loc.id, {})
                                );
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </Fragment>
    );
}
