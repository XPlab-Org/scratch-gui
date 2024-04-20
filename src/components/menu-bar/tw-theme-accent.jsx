import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';

import check from './check.svg';
import dropdownCaret from './dropdown-caret.svg';
import {MenuItem, Submenu} from '../menu/menu.jsx';
import {ACCENT_BLACK, ACCENT_LIGHTGREEN, ACCENT_MINT, ACCENT_MAGENTA, ACCENT_LIGHTBLUE, ACCENT_CORRUPTBLUE,
    ACCENT_ORANGE, ACCENT_GRAY,
    ACCENT_BLUE, ACCENT_GREEN, ACCENT_YELLOW, ACCENT_MAP, ACCENT_PURPLE,
    ACCENT_RED, Theme} from '../../lib/themes/index.js';
import {openAccentMenu, accentMenuOpen, closeSettingsMenu} from '../../reducers/menus.js';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/themePersistance.js';
import styles from './settings-menu.css';

const options = defineMessages({
    [ACCENT_RED]: {
        defaultMessage: 'Red',
        description: 'Name of the red color scheme, used by TurboWarp by default.',
        id: 'tw.accent.red'
    },
    [ACCENT_PURPLE]: {
        defaultMessage: 'Purple',
        description: 'Name of the purple color scheme. Matches modern Scratch.',
        id: 'tw.accent.purple'
    },
    [ACCENT_BLUE]: {
        defaultMessage: 'Blue',
        description: 'Name of the blue color scheme. Matches Scratch before the high contrast update.',
        id: 'tw.accent.blue'
    },
    [ACCENT_ORANGE]: {
        defaultMessage: 'Orange',
        description: 'Name of the orange color scheme, used by NitroBolt by default.',
        id: 'tw.accent.orange'
    },
    [ACCENT_LIGHTBLUE]: {
        defaultMessage: 'Light Blue',
        description: 'Name of the corrupted blue color scheme, used by PenguinMod by default.',
        id: 'tw.accent.lightblue'
    },
    [ACCENT_CORRUPTBLUE]: {
        defaultMessage: 'Corrupted Blue',
        description: 'Name of the corrupted blue color scheme, used by ElectraMod by default.',
        id: 'tw.accent.corruptblue'
    },
    [ACCENT_BLACK]: {
        defaultMessage: 'Black',
        description: 'Name of the black color scheme, used by ElectraMod as alternative accent.',
        id: 'tw.accent.black'
    },
    [ACCENT_MAGENTA]: {
        defaultMessage: 'Magenta',
        description: 'Name of the magenta color scheme, used by Snail IDE by default.',
        id: 'tw.accent.magenta'
    },
    [ACCENT_MINT]: {
        defaultMessage: 'Green Mint',
        description: 'Name of the mint color scheme, used by the legacy version of Snail IDE by default.',
        id: 'tw.accent.mint'
    },
    [ACCENT_LIGHTGREEN]: {
        defaultMessage: 'Light Green',
        description: 'Name of the mint color scheme, used by DinosaurMod by default.',
        id: 'tw.accent.lightgreen'
    },
    [ACCENT_GRAY]: {
        defaultMessage: 'Gray',
        description: 'Name of the gray color scheme, used by Unsandboxed by default.',
        id: 'tw.accent.gray'
    },
    [ACCENT_GREEN]: {
        defaultMessage: 'Green',
        description: 'Name of the green color scheme. Matches Scratch Lab.',
        id: 'tw.accent.green'
    },
    [ACCENT_YELLOW]: {
        defaultMessage: 'Yellow',
        description: 'Name of the yellow color scheme. used by JoeMod by default.',
        id: 'tw.accent.yellow'
    }
});

const ColorIcon = props => (
    <div
        className={styles.accentIconOuter}
        style={{
            backgroundColor: ACCENT_MAP[props.id].guiColors['looks-secondary']
        }}
    />
);

ColorIcon.propTypes = {
    id: PropTypes.string
};

const AccentMenuItem = props => (
    <MenuItem onClick={props.onClick}>
        <div className={styles.option}>
            <img
                className={classNames(styles.check, {[styles.selected]: props.isSelected})}
                width={15}
                height={12}
                src={check}
                draggable={false}
            />
            <ColorIcon id={props.id} />
            <FormattedMessage {...options[props.id]} />
        </div>
    </MenuItem>
);

AccentMenuItem.propTypes = {
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
};

const AccentThemeMenu = ({
    isOpen,
    isRtl,
    onChangeTheme,
    onOpen,
    theme
}) => (
    <MenuItem expanded={isOpen}>
        <div
            className={styles.option}
            onClick={onOpen}
        >
            <ColorIcon id={theme.accent} />
            <span className={styles.submenuLabel}>
                <FormattedMessage
                    defaultMessage="Accent"
                    description="Label for menu to choose accent color (eg. TurboWarp's red, Scratch's purple)"
                    id="tw.menuBar.accent"
                />
            </span>
            <img
                className={styles.expandCaret}
                src={dropdownCaret}
                draggable={false}
            />
        </div>
        <Submenu place={isRtl ? 'left' : 'right'}>
            {Object.keys(options).map(item => (
                <AccentMenuItem
                    key={item}
                    id={item}
                    isSelected={theme.accent === item}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => onChangeTheme(theme.set('accent', item))}
                />
            ))}
        </Submenu>
    </MenuItem>
);

AccentThemeMenu.propTypes = {
    isOpen: PropTypes.bool,
    isRtl: PropTypes.bool,
    onChangeTheme: PropTypes.func,
    onOpen: PropTypes.func,
    theme: PropTypes.instanceOf(Theme)
};

const mapStateToProps = state => ({
    isOpen: accentMenuOpen(state),
    isRtl: state.locales.isRtl,
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    },
    onOpen: () => dispatch(openAccentMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccentThemeMenu);
