import { Component } from 'preact';
import SDK from '../../api';
import { route } from 'preact-router';
import { loadConfig } from '../../lib/main';
import { Consumer } from '../../store';
import SwitchDepartment from './component';


export class SwitchDepartmentContainer extends Component {
	handleSubmit = async(fields) => {
		const { dispatch, room: { _id: rid } = {} } = this.props;
		const { department } = fields;

		// TODO: Modal t('Are_you_sure_do_you_want_switch_the_department')

		await dispatch({ loading: true });
		try {
			const result = await SDK.transferChat({ rid, department });
			const { success } = result;
			if (!success) {
				// TODO: Modal t('No_available_agents_to_transfer')
				return;
			}

			// TODO: Modal t('Department_switched')
			await dispatch({ department });
			await loadConfig();
			route('/');
		} catch (error) {
			// TODO: Modal error
		} finally {
			await dispatch({ loading: false });
		}
	}

	render = (props) => (
		<SwitchDepartment {...props} onSubmit={this.handleSubmit} />
	)
}

export const SwitchDepartmentConnector = ({ ref, ...props }) => (
	<Consumer>
		{({
			config: {
				departments = {},
				theme: {
					color,
				} = {},
			} = {},
			room = {},
			loading = false,
			department,
			dispatch,
		}) => (
			<SwitchDepartmentContainer
				ref={ref}
				{...props}
				title={I18n.t('Change Department')}
				color={color}
				loading={loading}
				message={I18n.t('Choose a department')}
				departments={departments.filter((dept) => dept.showOnRegistration && dept._id !== department)}
				dispatch={dispatch}
				room={room}
			/>
		)}
	</Consumer>
);


export default SwitchDepartmentConnector;
