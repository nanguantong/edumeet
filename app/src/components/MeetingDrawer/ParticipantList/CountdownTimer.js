import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRoomContext } from '../../../RoomContext';
import { useIntl, FormattedMessage } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Switch from '@material-ui/core/Switch';

const styles = (theme) =>
	({
		root :
		{
			padding     : theme.spacing(1),
			display     : 'flex',
			flexWrap    : 'wrap',
			marginRight : -theme.spacing(1),
			marginTop   : -theme.spacing(1)
		},
		button :
		{
			marginTop   : theme.spacing(1),
			marginRight : theme.spacing(1),
			flexGrow    : '1'
		},
		textfield :
		{
			marginTop   : theme.spacing(1),
			marginRight : theme.spacing(1),
			flexGrow    : '1'
		},
		countdownTimer :
		{
			marginTop      : theme.spacing(1),
			marginRight    : theme.spacing(2),
			flexGrow       : '1',
			justifyContent : 'space-between'
		}

	});

const CountdownTimer = (props) =>
{
	const intl = useIntl();

	const {
		roomClient,
		room,
		classes
	} = props;

	const countDownTimer =
	{
		inputRef : useRef(null),

		handleFocus : () =>
		{
			countDownTimer.inputRef.current.focus();

			const timeout = setTimeout(() =>
			{
				countDownTimer.inputRef.current.focus();
			}, 200);

			return () =>
			{
				clearTimeout(timeout);
			};
		}
	};

	return (
		<div className={classes.root}>
			<Grid
				className={classes.countdownTimer}
				container
				wrap='nowrap'
				alignItems='center'
			>
				<Grid item xs={8}>
					<TextField fullWidth
						aria-label={intl.formatMessage({
							id             : 'set.countdown',
							defaultMessage : 'Set timer'
						})}
						inputRef={countDownTimer.inputRef}
						className={classes.textfield}
						variant='outlined'
						label='timer (hh:mm:ss)'
						disabled={
							!room.countdownTimer.isEnabled ||
							(room.countdownTimer.isRunning &&
							room.countdownTimer.left !== '00:00:00')
						}
						type='time'
						value={room.countdownTimer.left}
						size='small'
						InputLabelProps={{
							shrink : true
						}}
						inputProps={{
							step : 1
						}}
						onChange={(e) => { roomClient.setCountdownTimer(e.target.value); }}
						onKeyPress={(e) =>
						{
							if (room.countdownTimer.left !== '00:00:00')
							{
								if (e.key === 'Enter')
								{
									roomClient.startCountdownTimer();
									e.preventDefault();
								}
							}
						}}
					/>
				</Grid>

				<Grid item xs={1}>
					<IconButton
						aria-label={intl.formatMessage({
							// id             : 'room.muteAll',
							id             : 'start.countdown',
							defaultMessage : 'Start'
						})}
						className={classes.button}
						variant='contained'
						color='secondary'
						size='small'
						disabled={
							!room.countdownTimer.isEnabled ||
							(
								room.countdownTimer.isRunning ||
								room.countdownTimer.left === '00:00:00'
							)
						}
						onClick={() =>
						{
							roomClient.setCountdownTimer('00:00:00');

							countDownTimer.handleFocus();
						}}
					>
						<HighlightOffIcon/>
					</IconButton>
				</Grid>

				{!room.countdownTimer.isRunning ?

					<Grid item xs={1}>
						<IconButton
							aria-label={intl.formatMessage({
								// id             : 'room.muteAll',
								id             : 'start.countdown',
								defaultMessage : 'Start'
							})}
							className={classes.button}
							variant='contained'
							color='secondary'
							size='small'
							disabled={
								!room.countdownTimer.isEnabled ||
								room.countdownTimer.left === '00:00:00'
							}
							onClick={() => roomClient.startCountdownTimer()}
						>
							<PlayArrowIcon/>
						</IconButton>
					</Grid>
					:
					<Grid item xs={1}>
						<IconButton fullWidth
							aria-label={intl.formatMessage({
								id             : 'stop.countdown',
								defaultMessage : 'Stop countdown'
							})}
							className={classes.button}
							variant='contained'
							color='secondary'
							size='small'
							disabled={
								!room.countdownTimer.isEnabled ||
								room.countdownTimer.left === '00:00:00'
							}
							onClick={() =>
							{
								roomClient.stopCountdownTimer();

								countDownTimer.handleFocus();
							}}
						>
							 <PauseIcon/>
						</IconButton>
					</Grid>
				}
				<Grid item xs={1}>
					<Switch
						className={classes.button}
						checked={room.countdownTimer.isEnabled}
						disabled={
							room.countdownTimer.isRunning
						}
						onChange={() =>
						{
							roomClient.toggleCountdownTimer(
								!room.countdownTimer.isEnabled
							);

							countDownTimer.handleFocus();
						}}
						name='checkedB'
						color='secondary'
						size='small'
					/>
				</Grid>

			</Grid>
		</div>
	);
};

CountdownTimer.propTypes =
{
	roomClient : PropTypes.any.isRequired,
	room       : PropTypes.object.isRequired,
	classes    : PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	room : state.room
});

export default withRoomContext(connect(
	mapStateToProps,
	null,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.room === next.room
			);
		}
	}
)(withStyles(styles)(CountdownTimer)));