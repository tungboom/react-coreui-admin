import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import { translate } from 'react-i18next';

class CustomReactTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <ReactTable
                columns={this.props.columns}
                manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                data={this.props.data}
                pages={this.props.pages} // Display the total number of pages
                loading={this.props.loading} // Display the loading overlay when we need it
                onFetchData={this.props.onFetchData} // Request new data when things change
                //filterable
                defaultPageSize={this.props.defaultPageSize}
                className="-striped -highlight"
                // Text
                previousText={t('common:common.table.previousText')}
                nextText={t('common:common.table.nextText')}
                loadingText={t('common:common.table.loadingText')}
                noDataText={t('common:common.table.noDataText')}
                pageText={t('common:common.table.pageText')}
                ofText={t('common:common.table.ofText')}
                rowsText={t('common:common.table.rowsText')}
                />
            </div>
        );
    }
}

CustomReactTable.propTypes = {
    onFetchData: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    pages: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    defaultPageSize: PropTypes.number.isRequired
};

export default translate()(CustomReactTable);
