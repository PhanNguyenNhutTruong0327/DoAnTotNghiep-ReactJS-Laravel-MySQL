import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './menu.css';
import categoryServices from "../../services/CategoryService";

function  Menu_Item(props) {

    const rowmenu = props.menu;
    const [menuItem, setMenuItem] = useState([]);

    useEffect(() => {
        // try {
            (async () => {
                await categoryServices.getListCategories(rowmenu.id).then(res => {
                    try{
                        setMenuItem(res.data.data);
                    }catch(err){console.log(err)};
                })
            })()
        // } catch (e) { console.log(e) }
    }, [])


    if (menuItem.length === 0) {
        return (
            <li className="nav-item">
                {console.log(menuItem)}
                <Link className="nav-link" to={`/danh-muc/${rowmenu.slug}/10/1`}>{rowmenu.name}</Link>
            </li>

        );
    }
    else {
        return (
            <li className="nav-item dropdown parent-menu">
                <Link className="nav-link dropdown-toggle" data-toggle="dropdown" to={`/danh-muc/${rowmenu.slug}/10/1`}> {rowmenu.name} </Link>
                <div className="dropdown-menu dropdown-large ps-3 child-menu">
                    <nav className="row">
                        <div className="" style={{padding: 0}}>
                            {menuItem.map((item, index) => {
                                return (
                                    <Link to={`/danh-muc/${item.slug}/10/1`} key={index}>{item.name}</Link>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </li>
        );
    }
}

export default Menu_Item;